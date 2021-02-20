const crypto = require('crypto');

// Should be async because it takes a lot of cpu
module.exports = function getHash(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
}