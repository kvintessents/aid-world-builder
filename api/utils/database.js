const mysql = require('mysql');

let connection = null;

// Database Connection for Production
if (global.process.env.NODE_ENV === 'production') {
    let config = {
        user: process.env.GCLOUD_SQL_USER,
        database: process.env.GCLOUD_SQL_DATABASE,
        password: process.env.GCLOUD_SQL_PASSWORD,
    };

    if (process.env.GCLOUD_SQL_INSTANCE_CONNECTION_NAME && process.env.NODE_ENV === 'production') {
        config.socketPath = `/cloudsql/${process.env.GCLOUD_SQL_INSTANCE_CONNECTION_NAME}`;
    }

    console.log('MySQL Connection Config:', config);

    connection = mysql.createConnection(config);

    connection.connect(function (err) {
        if (err) {
            console.error('Error connecting: ' + err.stack);
            return;
        }

        // Ensure DB exists
        connection.query('CREATE DATABASE IF NOT EXISTS `aid-world-builder`;');
        connection.changeUser({ database: 'aid-world-builder' });

        console.log('Connected as thread id: ' + connection.threadId);
    });
} else {
    // Database Connection for Development

    connection = mysql.createConnection({
        host: global.process.env.DB_HOST,
        user: global.process.env.DB_USER,
        // database: process.env.DB_DATABASE,
        password: global.process.env.DB_PASS,
    });

    connection.connect(function (err) {
        if (err) {
            console.error('Error connecting: ' + err.stack);
            return;
        }

        // Ensure DB exists
        connection.query('CREATE DATABASE IF NOT EXISTS `aid-world-builder`;');
        connection.changeUser({ database: 'aid-world-builder' });

        console.log('Connected as thread id: ' + connection.threadId);
    });
}

module.exports = connection;