const db = require('../utils/database');

function getTokenFromHeader(req) {
    if (typeof req.headers.authorization !== 'string') {
        return null;
    }

    const parts = decodeURIComponent(req.headers.authorization).split(' ');

    if (parts.length !== 2) {
        return null;
    }

    if (parts[0] !== 'Bearer') {
        return null;
    }

    if (parts[1].length !== 128) {
        return null;
    }

    return parts[1];
}

function getUserByToken(token, callback) {
    db.query('SELECT * FROM users WHERE token = ?', [token], callback);
}

module.exports = (req, res, next) => {
    const token = getTokenFromHeader(req);

    if (!token) {
        return next();
    }

    getUserByToken(token, (err, results) => {
        if (err) throw err;

        if (!results.length) {
            return next();
        }

        res.locals.user = results[0];

        next();
    });
};
