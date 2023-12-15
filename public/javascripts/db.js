const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root'
})

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as id', connection.threadId);

    // Check if the database exists
    connection.query('CREATE DATABASE IF NOT EXISTS BudgetBuddyDB', (err, results) => {
        if (err) {
            console.error('Error creating database:', err.stack);
            return;
        }
        console.log('Database created/connected successfully');

        // Select the database
        connection.changeUser({ database: 'BudgetBuddyDB' }, (err) => {
            if (err) {
                console.error('Error selecting database:', err.stack);
                return;
            }
            console.log('Database selected successfully');
        });
    });
});

module.exports = connection;

