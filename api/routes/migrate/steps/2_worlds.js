module.exports = async ({ sql, query }) => {
    return await query(sql`	
        CREATE TABLE IF NOT EXISTS worlds(	
            id INT unsigned AUTO_INCREMENT PRIMARY KEY,	
            user_id INT NOT NULL,	
            is_public TINYINT NOT NULL,	
            name VARCHAR(100) NOT NULL,	
            document LONGTEXT NOT NULL,	
            version BIGINT NOT NULL,	
            created_at TIMESTAMP NOT NULL	
        );	
    `);
}