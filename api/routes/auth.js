const crypto = require('crypto');
const { Router } = require('express');
const db = require('../utils/database');
const userAuthMiddleware = require('../middlewares/userAuth.middleware');
const { celebrate, Joi } = require('celebrate');

const router = Router();

// This is not secure. Salt should be user based.
const salt = process.env.USER_PASSWORD_SALT;

function getUserByEmail(email, callback) {
    db.query('SELECT * FROM users WHERE email = ?', [email], callback);
}

// Should be async because it takes a lot of cpu
function getHash(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
}

function userNotFound(res) {
    return res.status(404).json({ success: false, message: 'E-mail or password incorrect.' });
}

function setUserToken(value, user, callback) {
    db.query(
        `UPDATE users SET token = ? WHERE id = ?`,
        [ value, user.id ],
        callback,
    );
}

router.post('/auth/register', celebrate({
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(128).required(),
    }),
}), function (req, res) {
    getUserByEmail(req.body.email, (err, results) => {
        if (results.length) {
            return res.status(400).json({ success: false, error: 'User already exists.' });
        }

        const token = crypto.randomBytes(64).toString('hex');

        db.query(
            `
                INSERT INTO users
                    (email, password, token)
                VALUES
                    (?, ?, ?);
            `,
            [req.body.email, getHash(req.body.password, salt), token],
            (err, results) => {
                if (err) throw err;

                if (results.affectedRows) {
                    res.json({ success: true, data: { token } });
                } else {
                    res.status(500).json({ success: false, message: 'User was not registered. Please try again.' });
                }
            },
        );
    });
});

/* Log user in */
router.post('/auth/login', function (req, res) {
    getUserByEmail(req.body.email, (err, results) => {
        if (err) throw err;

        if (!results.length) {
            return userNotFound(res);
        }

        const user = results[0];

        if (user.password !== getHash(req.body.password, salt)) {
            return userNotFound(res);
        }

        if (!user.token) {
            const token = crypto.randomBytes(64).toString('hex');

            setUserToken(token, user, (err) => {
                if (err) throw err;

                return res.json({
                    success: true,
                    data: {
                        id: user.id,
                        token: token,
                    },
                });
            });
        } else {
            res.json({
                success: true,
                data: {
                    id: user.id,
                    token: user.token,
                },
            });
        }
    });
});

// Authorization should be middleware or simple callable function
router.post('/auth/logout', userAuthMiddleware, function (req, res) {
    res.json({ success: true, data: null });
});

// Authorization should be middleware or simple callable function
router.get('/auth/user', userAuthMiddleware, function (req, res) {
    const user = res.locals.user;

    return res.json({ success: true, data: { user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        token: user.token,
    } }});
});

module.exports = router;