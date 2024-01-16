const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    connectionLimit: 10
});
//TODO important, check this connectionLimit

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error getting connection:', err.stack);
        return;
    }
    console.log('Connection obtained successfully');
    // Select the database
    connection.changeUser({ database: 'BudgetBuddyDB' }, (err) => {
        if (err) {
            console.error('Error selecting database:', err.stack);
            return;
        }
        console.log('Database selected successfully');
        pool.releaseConnection(connection);
    });
});

module.exports = pool;
