const { Router } = require('express');
const router = Router();
const db = require('../utils/database');
const asyncRoute = require('../utils/asyncRoute');
const sql = require('sql-template-strings');
const { promisify } = require('util');
const { celebrate, Joi } = require('celebrate');
const userAuth = require('../middlewares/userAuth.middleware');

const query = promisify(db.query).bind(db);

async function addVote({ post_id, user_id, score }) {
    return await query(sql`
        INSERT INTO upvotes
            (post_id, user_id, score, created_at)
        VALUES
            (${post_id}, ${user_id}, ${score}, ${new Date()})
        ON DUPLICATE KEY UPDATE
            score = ${score}
    `);
}

async function deleteVote({ post_id, user_id }) {
    return await query(sql`
        DELETE FROM upvotes WHERE post_id = ${post_id} AND user_id = ${user_id};
    `);
}

router.post('/upvotes', userAuth, celebrate({
    body: Joi.object().keys({
        user_id: Joi.number().required(),
        post_id: Joi.number().required(),
        score: Joi.number().valid(1, -1, null).required(),
    }),
}), asyncRoute(async function (req, res) {
    const { score } = req.body;

    let result = null;

    if (score === null) {
        result = await deleteVote(req.body);
    } else {
        result = await addVote(req.body);
    }

    res.json({ success: true, data: result });
}));

// router.get('/recreate/upvotes', asyncRoute(async function (req, res) {
//     await query(`DROP TABLE IF EXISTS upvotes`);

//     const { result, fields } = await query(sql`
//         CREATE TABLE IF NOT EXISTS upvotes(
//             id INT unsigned AUTO_INCREMENT PRIMARY KEY,
//             post_id INT NOT NULL,
//             user_id INT NOT NULL,
//             score TINYINT NOT NULL,
//             created_at TIMESTAMP NOT NULL,
//             UNIQUE KEY user_vote (post_id,user_id)
//         );
//     `);

//     res.json({ success: true, data: { result, fields } });
// }));

module.exports = router;