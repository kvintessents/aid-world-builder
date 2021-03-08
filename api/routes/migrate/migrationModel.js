const sql = require('sql-template-strings');
const query = require('../../utils/query');

module.exports = {
    async ensure() {
        return await query(sql`
            CREATE TABLE IF NOT EXISTS migration(
                id INT unsigned PRIMARY KEY
            );
        `);
    },
    async getFullList() {
        return await query(sql`
            SELECT * FROM migration LIMIT 9999
        `);
    },
    async markAsDone(id) {
        return await query(sql`
            INSERT INTO migration
                (id)
            VALUES
                (${id});
        `);
    },
};
