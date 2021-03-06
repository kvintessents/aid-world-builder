module.exports = async ({ sql, query }) => {
    await query(sql`
        ALTER TABLE users
        ADD is_admin TINYINT;
    `);

    await query(sql`
        UPDATE users SET is_admin = 1 WHERE id = 1;
    `);
};
