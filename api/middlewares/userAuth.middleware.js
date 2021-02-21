const db = require('../utils/database');
const jwt = require('../utils/jwt');
const asyncMiddleware = require('../utils/asyncMiddleware');
const { promisify } = require('util');

const query = promisify(db.query).bind(db);

function respondUnauthorized(res) {
    return res.status(401).json({
        success: false,
        message: 'Unauthorized.',
    });
}

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

function getUserByToken(token) {
    return query('SELECT * FROM users WHERE token = ?', [token]);
}

module.exports = asyncMiddleware(async (req, res) => {
    const jwtPayload = await jwt.getUser(req);

    if (jwtPayload) {
        res.locals.user = jwtPayload;
        return;
    }

    const token = getTokenFromHeader(req);

    if (!token) {
        return;
    }

    const results = await getUserByToken(token);

    if (!results.length) {
        return respondUnauthorized(res);
    }

    // Create JWT
    const newPayload = await jwt.setUser(res, results[0]);

    res.locals.user = newPayload;
});
