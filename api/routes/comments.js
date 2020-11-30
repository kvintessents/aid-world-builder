const { Router } = require('express');
const router = Router();
const db = require('../utils/database');
const asyncRoute = require('../utils/asyncRoute');
const sql = require('sql-template-strings');
const { promisify } = require('util');
const { celebrate, Joi } = require('celebrate');
const userAuth = require('../middlewares/userAuth.middleware');
const dbUtils = require('../utils/dbUtils');
const replaceTags = require('../utils/replaceTags');
const marked = require('marked');

const query = promisify(db.query).bind(db);

function createCommentItem(comment) {
    comment = dbUtils.getHierarchical(comment);

    return {
        ...comment,
        comment_marked: marked(replaceTags(comment.comment), { breaks: true }),
    };
}

router.post('/comments/', userAuth, celebrate({
    body: Joi.object().keys({
        post_id: Joi.number().required(),
        parent_id: Joi.number().allow(null),
        comment: Joi.string().min(1).required(),
    }),
}), asyncRoute(async function (req, res) {
    if (!res.locals.user.display_name) {
        res.json({ success: false, message: 'Missing display_name. Use the PUT /users endpoint to set.' });
    }

    const { post_id, parent_id, comment } = req.body;

    const response = await query(sql`
        INSERT INTO comments
            (post_id, user_id, parent_id, comment, created_at)
        VALUES
            (${post_id}, ${res.locals.user.id}, ${parent_id}, ${comment}, ${new Date()})
    `);

    res.json({ success: true, data: response });
}));

router.get('/comments', celebrate({
    query: Joi.object().keys({
        post_id: Joi.number().required(),
    }),
}), asyncRoute(async function (req, res) {
    const { post_id } = req.query;

    const results = (await query(sql`
        SELECT
            comments.*,
            users.id as user__id,
            users.display_name as user__display_name
        FROM comments
        LEFT JOIN users ON comments.user_id = users.id
        WHERE comments.post_id = ${post_id}
        ORDER BY comments.created_at DESC
    `)).map(createCommentItem);

    res.json({ success: true, data: results });
}));

// router.get('/recreate/comments', asyncRoute(async function (req, res) {
//     await query(sql`
//         DROP TABLE IF EXISTS comments
//     `);

//     const { result, fields } = await query(sql`
//         CREATE TABLE IF NOT EXISTS comments(
//             id INT unsigned AUTO_INCREMENT PRIMARY KEY,
//             post_id INT NOT NULL,
//             user_id INT NOT NULL,
//             parent_id INT,
//             comment TEXT NOT NULL,
//             created_at TIMESTAMP NOT NULL
//         );
//     `);

//     res.json({ success: true, data: { result, fields } });
// }));

module.exports = router;