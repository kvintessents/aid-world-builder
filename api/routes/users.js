const { Router } = require('express');
const db = require('../utils/database');
const userAuthMiddleware = require('../middlewares/userAuth.middleware');
const sql = require('sql-template-strings');

const router = Router();

/* GET user by ID. */
router.get('/users/:id', function (req, res) {
    res.json({});
});

// List all users
router.get('/users', userAuthMiddleware, function (req, res) {
    db.query(
        sql`
            SELECT
                id, email, display_name, active, created_at
            FROM
                users
        `,
        (err, result) => {
            if (err) throw err;

            res.json({ success: true, data: result });
        },
    );
});

// Modify user
router.put('/users/:id', userAuthMiddleware, function (req, res) {
    const displayName = req.body.display_name;
    const id = res.locals.user.id;
    if (
        // Not logged in
        !res.locals.user ||
        // Wrong user
        id.toString() !== req.params.id.toString() ||
        // Already has a username
        res.locals.user.display_name
    ) {
        return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    if (displayName.length < 3) {
        return res.status(403).json({ success: false, message: 'Display name too short.' });
    }

    db.query(
        sql`
            UPDATE users
            SET display_name = ${displayName}
            WHERE id = ${id}
        `,
        (err, result, fields) => {
            if (err) throw err;

            res.json({ success: true, data: { result, fields } });
        },
    );
});

// router.get('/recreate/users', function (req, res) {	
//     db.query(sql`DROP TABLE IF EXISTS users`, (err) => {	
//         if (err) throw err;	

//         db.query(sql`	
//             CREATE TABLE IF NOT EXISTS users(	
//                 id INT AUTO_INCREMENT PRIMARY KEY,	
//                 email VARCHAR(255) NOT NULL,	
//                 password VARCHAR(255) NOT NULL,	
//                 display_name VARCHAR(255),	
//                 token VARCHAR(128),	
//                 token_expires TIMESTAMP,	
//                 active TINYINT NOT NULL DEFAULT 1,	
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP	
//             );	
//         `, (err, result, fields) => {	
//             if (err) throw err;	

//             res.json({ success: true, data: { result, fields } });	
//         });	
//     });	
// });

/* GET users listing. */
router.get('/users', function (req, res) {
    res.json({});
});

module.exports = router;