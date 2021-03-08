const { promisify } = require('util');
const db = require('./database');

module.exports = promisify(db.query).bind(db);
