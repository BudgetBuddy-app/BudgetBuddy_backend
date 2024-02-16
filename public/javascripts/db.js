const mysql = require('mysql2');
require('dotenv').config();

//TODO make DB password depend on .env? or on compose.yaml?
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    connectionLimit: (process.env.CONNECTION_LIMIT || 10)
});

function getConnectionWithRetry() {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err.stack);
            console.log('Retrying connection in  10 seconds...');
            setTimeout(getConnectionWithRetry, 10000); // Retry after  10 seconds
        } else {
            console.log('Connection obtained successfully');
            // Select the database
            connection.changeUser({ database: 'BudgetBuddyDB' }, (err) => {
                if (err) {
                    console.error('Error selecting database:', err.stack);
                    console.log('Retrying connection in  10 seconds...');
                    setTimeout(getConnectionWithRetry, 10000); // Retry after  10 seconds
                    return;
                }
                console.log('Database selected successfully');
                pool.releaseConnection(connection);
            });
        }
    });
}

getConnectionWithRetry(); // Start the connection attempt

module.exports = pool;
