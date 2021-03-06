module.exports = async ({ sql, query }) => {
    return await query(sql`
        CREATE TABLE IF NOT EXISTS feedback(
            id INT unsigned AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            feedback TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL
        );
    `);
};
