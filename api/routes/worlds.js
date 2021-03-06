const { promisify } = require('util');
const { Router } = require('express');
const router = Router();
const sql = require('sql-template-strings');
const { celebrate, Joi } = require('celebrate');
const { escape } = require('sqlstring');
const db = require('../utils/database');
const asyncRoute = require('../utils/asyncRoute');
const userAuth = require('../middlewares/userAuth.middleware');

const query = promisify(db.query).bind(db);

async function saveWorld({ id, document, userId, isPublic, name }) {
    let publicTerm = '';
    let nameTerm = '';

    if (typeof isPublic === 'boolean') {
        publicTerm = `, is_public = ${isPublic ? 1 : 0}`;
    }

    if (typeof name === 'string' && name.trim().length) {
        nameTerm = `, name = ${escape(name)}`;
    }

    const command = `
        UPDATE worlds
        SET
            document = ${escape(document)} ${publicTerm} ${nameTerm}
        WHERE id = ${escape(id)} AND user_id = ${parseInt(userId)};
    `;

    const result = await query(command);

    return result;
}

async function createWorld({ name, isPublic, userId }) {
    const document = {
        id: null,
        nodes: [],
        lastId: 0,
    };

    return await query(sql`
        INSERT INTO worlds
            (user_id, name, is_public, document, version, created_at)
        VALUES
            (${userId}, ${name}, ${isPublic}, ${JSON.stringify(document)}, 0, ${new Date()})
    `);
}

router.get('/worlds/', userAuth, asyncRoute(async function(req, res) {
    const userId = res.locals.user.id;

    const result = await query(sql`
        SELECT
            id, name, is_public, user_id, version, created_at, LENGTH(document) as document_length
        FROM worlds
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
    `);

    res.json({ success: true, data: result });
}));

router.get('/public-worlds/', asyncRoute(async function(req, res) {
    const result = await query(sql`
        SELECT
            id, name, is_public, user_id, version, created_at, LENGTH(document) as document_length
        FROM worlds
        WHERE is_public = 1
        ORDER BY created_at DESC
    `);

    res.json({ success: true, data: result });
}));

router.get('/worlds/:id', userAuth, asyncRoute(async function(req, res) {
    const userId = res.locals.user && res.locals.user.id ? parseInt(res.locals.user.id) : null;
    const isAdmin = Boolean(res.locals.user && res.locals.user.is_admin);

    let result;

    if (isAdmin) {
        result = await query(sql`
            SELECT * FROM worlds WHERE id = ${req.params.id}
        `);
    } else {
        result = await query(sql`
            SELECT * FROM worlds WHERE id = ${req.params.id} AND (user_id = ${userId} OR is_public = 1)
        `);
    }

    if (!result || !result[0]) {
        return res.status(404).json({ success: false });
    }

    res.json({ success: true, data: result[0] });
}));

router.post('/worlds/', userAuth, celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2),
        isPublic: Joi.boolean(),
    }),
}), asyncRoute(async function(req, res) {
    const result = await createWorld({
        name: req.body.name,
        userId: res.locals.user.id,
        isPublic: req.body.isPublic ? 1 : 0,
    });

    res.json({
        success: true,
        data: {
            id: result.insertId,
        },
    });
}));

// UPDATE WORLD
router.post('/world/:id', userAuth, celebrate({
    params: {
        id: Joi.number().required(),
    },
    body: Joi.object().keys({
        document: Joi.string().required(),
        isPublic: Joi.boolean().default(null),
        version: Joi.number().required(),
        name: Joi.string().default(null),
    }),
}), asyncRoute(async function(req, res) {
    if (!res.locals.user || !res.locals.user.id) {
        return res.status(403).json({ success: false });
    }

    const { version, document, isPublic, name } = req.body;

    const result = await saveWorld({
        id: req.params.id,
        userId: res.locals.user.id,
        version,
        isPublic,
        name,
        document,
    });

    res.json({ success: true, data: result });
}));

module.exports = router;
