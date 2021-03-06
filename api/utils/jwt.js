const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const privateKey = fs.readFileSync(path.join(__dirname, '../config/jwtRS256.key'));
const algorithm = 'RS256';
const expiresIn = '1d';
const cookieName = 'aidwd_jwt_token';

const signPromise = promisify(jwt.sign.bind(jwt));
const verifyPromise = promisify(jwt.verify.bind(jwt));

module.exports = {
    async generate(data) {
        return await signPromise(
            data,
            privateKey,
            { algorithm, expiresIn },
        );
    },
    async getUser(req) {
        const token = req.cookies[cookieName];

        if (!token || token === 'false') {
            return null;
        }

        try {
            return await verifyPromise(
                token,
                privateKey,
                { algorithms: [algorithm], maxAge: expiresIn },
            );
        } catch (e) {
            console.error('jwt.js', e.message);

            return null;
        }
    },

    // eslint-disable-next-line camelcase
    async setUser(res, { id, email, is_admin, active, display_name, token }) {
        const user = { id, email, is_admin, active, display_name, token };
        res.cookie(cookieName, await this.generate(user));

        return user;
    },
    clearCookie(res) {
        res.cookie(cookieName, 'false');
    },
};
