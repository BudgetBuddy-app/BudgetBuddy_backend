const mysql = require('mysql2');
require('dotenv').config();

const sqlQueries = require('./sqlQueries.js');

//TODO make DB password depend on .env? or on compose.yaml?
//TODO if using dev environment, hot should be "localhost", if using docker, it should be "mysql", maybe add to env
//TODO this entire file could probably be optimized removing promises for asyncs and whatnot

//TODO test dev after docker, se if I didn't break the dev server

const pool = mysql.createPool({
    host: 'mysql',
    user: 'root',
    password: 'root',
    connectionLimit: (process.env.CONNECTION_LIMIT || 10)
});

function runCreateTableScripts(db) {
    return new Promise((resolve, reject) => {
        const createTablePromises = sqlQueries.createTables.map(table => {
            console.log('Creating table: ' + table.name);
            return new Promise((resolve, reject) => {
                db.query(table.query, (err, results) => {
                    if (err) {
                        console.error('Error executing query \n', err.stack);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        });

        Promise.all(createTablePromises)
            .then(() => {
                console.log("Tables created successfully!");
                resolve();
            })
            .catch(err => {
                console.error('ERROR: a table was not created \n' + err);
                reject(err);
            });
    });
}

async function getConnectionWithRetry() {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err.stack);
            console.log('Retrying connection in  10 seconds...');
            setTimeout(getConnectionWithRetry, 10000); // Retry after  10 seconds
        } else {
            console.log('Connection obtained successfully');
            // Check if the database exists and create it if it doesn't
            connection.query('CREATE DATABASE IF NOT EXISTS BudgetBuddyDB', (err, results) => {
                if (err) {
                    console.error('Error creating database:', err.stack);
                    console.log('Retrying connection in  10 seconds...');
                    setTimeout(getConnectionWithRetry, 10000); // Retry after  10 seconds
                    return;
                }

                console.log('Database created successfully');
                // Select the database
                connection.changeUser({ database: 'BudgetBuddyDB' }, (err) => {
                    if (err) {
                        console.error('Error selecting database:', err.stack);
                        console.log('Retrying connection in  10 seconds...');
                        setTimeout(getConnectionWithRetry, 10000); // Retry after  10 seconds
                        return;
                    }
                    runCreateTableScripts(connection).then(value => {

                        console.log('DATABASE SETUP COMPLETE!');
                        pool.releaseConnection(connection);
                    })
                })
            });
        }
    });
}

getConnectionWithRetry(); // Start the connection attempt

module.exports = pool;
