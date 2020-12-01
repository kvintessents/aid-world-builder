const { Router } = require('express');
const router = Router();
const db = require('../utils/database');
const asyncRoute = require('../utils/asyncRoute');
const sql = require('sql-template-strings');
const { promisify } = require('util');
const { celebrate, Joi } = require('celebrate');
const userAuth = require('../middlewares/userAuth.middleware');

const query = promisify(db.query).bind(db);

async function saveWorld({ id, version, document }) {
    const result = await query(sql`
        UPDATE worlds
        SET document = ${document}
        WHERE id = ${id};
    `);

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

router.get('/worlds/', userAuth, celebrate({
    params: Joi.object().keys({
        user_id: Joi.number().default(null),
    }),
}), asyncRoute(async function (req, res) {
    const result = await query(sql`
        SELECT id, name, is_public, user_id, version, created_at FROM worlds
    `);

    res.json({ success: true, data: result });
}));

router.get('/worlds/:id', userAuth, asyncRoute(async function (req, res) {
    const result = await query(sql`
        SELECT * FROM worlds WHERE id = ${req.params.id}
    `);

    res.json({ success: true, data: result[0] });
}));

router.post('/worlds/', userAuth, celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2),
        isPublic: Joi.boolean(),
    }),
}), asyncRoute(async function (req, res) {
    const result = await createWorld({
        name: req.body.name,
        userId: res.locals.user.id,
        isPublic: req.body.isPublic ? 1 : 0,
    });

    res.json({
        success: true,
        data: {
            id: result.insertId
        }
    });
}));

// UPDATE WORLD
router.post('/world/:id', userAuth, celebrate({
    params: {
        id: Joi.number().required()
    },
    body: Joi.object().keys({
        document: Joi.string().required(),
        version: Joi.number().required(),
    }),
}), asyncRoute(async function (req, res) {
    const { version, document } = req.body;

    const result = await saveWorld({
        id: req.params.id,
        version,
        document
    });

    res.json({ success: true, data: result });
}));

router.get('/recreate/worlds', asyncRoute(async function (req, res) {
    await query(`DROP TABLE IF EXISTS worlds`);

    const { result, fields } = await query(sql`
        CREATE TABLE IF NOT EXISTS worlds(
            id INT unsigned AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            is_public TINYINT NOT NULL,
            name VARCHAR(100) NOT NULL,
            document LONGTEXT NOT NULL,
            version BIGINT NOT NULL,
            created_at TIMESTAMP NOT NULL
        );
    `);

    res.json({ success: true, data: { result, fields } });
}));

module.exports = router;