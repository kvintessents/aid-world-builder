module.exports = async ({ sql, query }) => {
    return await query(sql`
        CREATE TABLE IF NOT EXISTS users(
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            display_name VARCHAR(255),
            token VARCHAR(128),
            token_expires TIMESTAMP,
            active TINYINT NOT NULL DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
};
