module.exports = {
    createTables: [
        {
            name: 'Users',
            query: `CREATE TABLE IF NOT EXISTS users(
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255) UNIQUE,
                password VARCHAR(255)
                );`
        },
        {
            name: 'Accounts',
            query: `CREATE TABLE IF NOT EXISTS accounts(
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                name VARCHAR(255),
                FOREIGN KEY (user_id) REFERENCES users(id)
                );`
        },
        {
            name: 'Transactions',
            query: `CREATE TABLE IF NOT EXISTS transactions(
            id INT AUTO_INCREMENT PRIMARY KEY,
            amount DECIMAL(10, 2),
            date DATE,
            recipient VARCHAR(255),
            account_id INT,
            notes VARCHAR(255),
            FOREIGN KEY (account_id) REFERENCES accounts(id)
            );`
        }
    ],
    dropTables: [
        {
            name: 'dropTransactionsTableQuery',
            query: `DROP TABLE IF EXISTS transactions;`
        },
        {
            name: 'dropAccountsTableQuery',
            query: `DROP TABLE IF EXISTS accounts;`
        },
        {
            name: 'dropUsersTableQuery',
            query: `DROP TABLE IF EXISTS users;`
        }
    ],
    insertDummyData: [
        {
            name: 'Users',
            query: `INSERT INTO users(name, email, password) VALUES 
                    ('John Doe', 'john.doe@example.com', 'password123'),
                    ('Jane Doe', 'jane.doe@example.com', 'password456');`
        },
        {
            name: 'Accounts',
            query: `INSERT INTO accounts(user_id, name) VALUES 
                    (1, 'Checking Account'),
                    (2, 'Savings Account');`
        },
        {
            name: 'Transactions',
            query: `INSERT INTO transactions(amount, date, recipient, account_id, notes) VALUES 
                    (1000.00, '2023-12-15', 'Lidl', 1, 'Transaction 1'),
                    (-1000, '2023-12-15', 'Lidl', 1, 'Transaction 3'),
                    (2000.00, '2023-12-16', 'Mcdonalds', 2, 'Transaction 2');`
        }
    ]
};
