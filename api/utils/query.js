const db = require('./database');
const { promisify } = require('util');

module.exports = promisify(db.query).bind(db);