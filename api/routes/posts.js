const { Router } = require('express');
const db = require('../utils/database');
const dbUtils = require('../utils/dbUtils');
const replaceTags = require('../utils/replaceTags');
const asyncRoute = require('../utils/asyncRoute');
const userAuthMiddleware = require('../middlewares/userAuth.middleware');
const userAuthOptionalMiddleware = require('../middlewares/userAuthOptional.middleware');
const normalizeUrl = require('normalize-url');
const slugify = require('slugify');
const { promisify } = require('util');
const sql = require('sql-template-strings');
const { celebrate, Joi } = require('celebrate');
const marked = require('marked');

const router = Router();

const query = promisify(db.query).bind(db);

const ignoredThumbnailStates = ['na', 'fetching'];

function getSlug(string) {
    return slugify(string, {
        replacement: '_',
        lower: true,
        strict: true,
    }).slice(0, 40);
}

const shortDomains = {
    'pmo.ee': 'postimees.ee',
};

const imageHosts = [
    'i.imgur.com',
    'www.imgur.com',
    'imgur.com',
];

function translateShortDomain(domain) {
    if (shortDomains[domain]) {
        return shortDomains[domain];
    }

    return domain;
}

function createPostItem(post) {
    post = dbUtils.getHierarchical(post);
    const domain = post.link ? translateShortDomain(new URL(post.link).hostname) : undefined;
    const thumbnail = ignoredThumbnailStates.includes(post.thumbnail) ? null : post.thumbnail;

    return {
        ...post,
        text_marked: post.text ? marked(replaceTags(post.text), { breaks: true }) : post.text,
        short_text_marked: post.text ? marked(replaceTags(post.short_text), { breaks: true }) : post.short_text,
        thumbnail: thumbnail,
        permalink_path: `/artikkel/${post.id}/${post.slug}`,
        link_domain: domain,
        thumbnail_path: thumbnail ? `/api/thumbnails/?name=${post.thumbnail}` : null,
    };
}

async function getPostById(id, userId) {
    const postQuery = sql`
        SELECT
            users.display_name as user__display_name,
            users.id as user__id,
            posts.*,
            score.score as score,
            user_score.score as user_score

        FROM posts

        LEFT JOIN users ON posts.user_id = users.id

        LEFT JOIN (
            SELECT
                post_id,
                SUM(score) AS score
            FROM
                upvotes
            GROUP BY
                post_id
        ) as score ON score.post_id = posts.id

        LEFT JOIN (
            SELECT
                post_id,
                score
            FROM
                upvotes
            WHERE user_id = ${userId}
        ) as user_score ON user_score.post_id = posts.id

        WHERE posts.id = ${id}
    `;

    const result = await query(postQuery);

    if (result.length === 0) {
        return null;
    }

    return result[0];
}

function getSubtype({ type, link }) {
    if (type === 'link') {
        const url = new URL(link);

        if (imageHosts.includes(url.hostname)) {
            return 'image';
        }
    }

    return null;
}

/* Create new post */
router.post('/posts', celebrate({
    body: Joi.object().keys({
        type: Joi.string().valid('link', 'text', 'image').required(),
        subject: Joi.string().trim().min(3).required(),
        text: Joi.string().trim(),
        link: Joi.string().trim(),
    }),
}), userAuthMiddleware, asyncRoute(async function (req, res) {
    if (!res.locals.user.display_name) {
        return res.status(403).json({ success: false, message: 'Display name required for this action.' });
    }

    if (req.body.type === 'image') {
        return res.status(501).json({ success: false, message: 'API for images not yet implemented.' });
    }

    const subtype = getSubtype(req.body);
    const type = req.body.type;

    const subject = req.body.subject.trim().slice(0, 250).trim();

    const fields = {
        user_id: res.locals.user.id,
        type: type,
        subtype: subtype,
        subject: subject,
        slug: getSlug(subject),
        created_at: new Date(),
    };

    if (type === 'link') {
        Object.assign(fields, {
            link: normalizeUrl(req.body.link),
        });
    } else if (type === 'text') {
        const text = req.body.text;

        if (typeof text !== 'string' || text.length < 1) {
            return res.status(400).json({ success: false, message: 'Text body has to be at least 1 character long.' });
        }

        Object.assign(fields, {
            text: req.body.text,
            short_text: req.body.text.slice(0, 250),
        });
    }

    // Check if link already exists in this category
    if (type === 'link') {
        const result = await query(sql`SELECT * FROM posts where link = ${fields.link} LIMIT 1`);

        if (result.length) {
            return res.status(409).json({ success: false, message: 'Link already exists in this category.' });
        }
    }

    const keys = Object.keys(fields);
    const template = keys.map(() => '?').join(',');
    const values = keys.map(key => fields[key]);

    const response = await query(`
        INSERT INTO posts
            (${keys.join(',')})
        VALUES
            (${template});
    `, values);

    await query(sql`
        INSERT INTO upvotes
            (post_id, user_id, score, created_at)
        VALUES
            (${response.insertId}, ${res.locals.user.id}, 1, ${new Date()})
    `);

    res.json({ success: true, data: { result: response } });
}));

router.get('/posts/:id', userAuthOptionalMiddleware, asyncRoute(async function(req, res) {
    if (!req.params.id) {
        return res.status(400).json({ success: false, message: 'Post ID missing.' });
    }

    const parts = req.params.id.trim().split('/');
    const id = parts[0].trim();
    const userId = res.locals && res.locals.user ? res.locals.user.id : null;

    const post = await getPostById(id, userId);

    if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    res.json({ success: true, data: createPostItem(post) });
}));

/* Get list of posts */
router.get('/posts', celebrate({
    query: Joi.object().keys({
        offset: Joi.number().default(0),
    }),
}), userAuthOptionalMiddleware, asyncRoute(async function (req, res) {
    const offset = parseInt(req.query.offset, 10);
    const userId = res.locals && res.locals.user ? res.locals.user.id : null;

    const posts = (await query(sql`
        SELECT
            posts.*,
            
            -- USER
            users.display_name as user__display_name,
            users.id as user__id,

            -- SCORE
            score.score AS score,
            user_score.score AS user_score,

            -- HOTNESS
            ROUND(
                (COALESCE(score.sgn, 0) * COALESCE(score.ordr, 1)) +
                (COALESCE(posts.age_epoch, 0) / 25000)
            , 7) AS hotness,

            -- COMMENT COUNT
            COALESCE(comments.num, 0) as num_comments
        FROM
            (
                SELECT
                    *,
                    UNIX_TIMESTAMP(created_at) - 1600000000 AS age_epoch
                FROM posts
            ) as posts

        LEFT JOIN users ON posts.user_id = users.id

        -- HOTNESS
        LEFT JOIN
            (
                SELECT
                    post_id,
                    score,

                    LOG(10, GREATEST(ABS(score), 1)) AS ordr,

                    IF(
                        score > 0, 1, IF(
                            score < 0, -1, 0
                        )
                    ) AS sgn
                FROM
                    (
                        SELECT
                            post_id,
                            SUM(score) AS score
                        FROM
                            upvotes
                        GROUP BY
                            post_id
                    ) as inner_score
            ) as score
        ON score.post_id = posts.id

        -- USER VOTE
        LEFT JOIN (
            SELECT
                post_id,
                score
            FROM
                upvotes
            WHERE user_id = ${userId}
        ) as user_score ON user_score.post_id = posts.id

        -- COMMENT COUNT
        LEFT JOIN (
            SELECT post_id, COUNT(1) as num FROM comments GROUP BY post_id
        ) as comments ON comments.post_id = posts.id

        ORDER BY
            hotness DESC
        LIMIT 20
        OFFSET ${offset}
    `))
        .map(createPostItem);

    res.json({ success: true, data: posts });
}));

router.get('/recreate/posts', function (req, res) {
    return res.status(404);

    // db.query(`DROP TABLE IF EXISTS posts`, (err) => {
    //     if (err) throw err;

    //     db.query(sql`
    //         CREATE TABLE IF NOT EXISTS posts(
    //             id INT AUTO_INCREMENT PRIMARY KEY,
    //             user_id INT NOT NULL,
    //             type ENUM('text', 'link', 'upload', 'poll', 'image') NOT NULL,
    //             subtype ENUM('image', 'blog'),
    //             subject VARCHAR(255) NOT NULL,
    //             slug VARCHAR(50) NOT NULL,
    //             text TEXT,
    //             short_text VARCHAR(255),
    //             link VARCHAR(255),
    //             thumbnail VARCHAR(255),
    //             created_at TIMESTAMP NOT NULL
    //         );
    //     `, (err, result, fields) => {
    //         if (err) throw err;

    //         res.json({ success: true, data: { result, fields } });
    //     });
    // });
});

router.get('/alter/posts/add-subtype', asyncRoute(async function (req, res) {
    let response = await query(sql`DESCRIBE posts`);

    if (response.find(column => column.Field === 'subtype')) {
        return res.json({ success: true, data: {} });
    }

    response = await query(sql`
        ALTER TABLE
            posts
        ADD COLUMN
            subtype ENUM('image', 'blog')
        AFTER type
    `);

    return res.json({ success: true, data: response });
}));

router.get('/debug/posts', asyncRoute(async function (req, res) {
    const description = await query(sql`DESCRIBE posts`);
    const items = await query(sql`SELECT * FROM posts LIMIT 20`);

    return res.json({success: true, description, items});
}));



module.exports = router;