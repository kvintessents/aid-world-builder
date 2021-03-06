const { promisify } = require('util');
const { Router } = require('express');
const router = Router();
const sql = require('sql-template-strings');
const { celebrate, Joi } = require('celebrate');
const db = require('../utils/database');
const asyncRoute = require('../utils/asyncRoute');
const userAuth = require('../middlewares/userAuth.middleware');

const query = promisify(db.query).bind(db);

router.post('/feedback/', userAuth, celebrate({
    body: Joi.object().keys({
        anonymous: Joi.boolean().default(false),
        feedback: Joi.string().min(1).required(),
    }),
}), asyncRoute(async function(req, res) {
    if (!res.locals.user) {
        return res.json(404);
    }

    const { feedback } = req.body;

    const response = await query(sql`
        INSERT INTO feedback
            (user_id, feedback, created_at)
        VALUES
            (${res.locals.user.id}, ${feedback}, ${new Date()})
    `);

    res.json({ success: true, data: response });
}));

router.get('/feedback', userAuth, asyncRoute(async function(req, res) {
    if (!res.locals.user || res.locals.user.id !== 1) {
        return res.status(404);
    }

    const results = await query(sql`
        SELECT
            *
        FROM feedback
        ORDER BY feedback.created_at DESC
    `);

    res.json({ success: true, data: results });
}));

router.get('/recreate/feedback', asyncRoute(async function(req, res) {
    await query(sql`
        DROP TABLE IF EXISTS feedback
    `);

    const { result, fields } = await query(sql`
        CREATE TABLE IF NOT EXISTS feedback(
            id INT unsigned AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            feedback TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL
        );
    `);

    res.json({ success: true, data: { result, fields } });
}));

module.exports = router;
