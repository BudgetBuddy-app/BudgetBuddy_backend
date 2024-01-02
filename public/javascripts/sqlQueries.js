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
            name: 'Recipients',
            query: `CREATE TABLE IF NOT EXISTS recipients(
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) UNIQUE
                );`
        },
        {
            name: 'Transactions',
            query: `CREATE TABLE IF NOT EXISTS transactions(
            id INT AUTO_INCREMENT PRIMARY KEY,
            amount DECIMAL(10, 2),
            type ENUM('W', 'D'),
            date DATE,
            recipient_id INT,
            account_id INT,
            notes VARCHAR(255),
            FOREIGN KEY (recipient_id) REFERENCES recipients(id),
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
            name: 'dropRecipientsTableQuery',
            query: `DROP TABLE IF EXISTS recipients;`
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
            name: 'Recipients',
            query: `INSERT INTO recipients(name) VALUES 
                    ('Recipient 1'),
                    ('Recipient 2');`
        },
        {
            name: 'Transactions',
            query: `INSERT INTO transactions(amount, type, date, recipient_id, account_id, notes) VALUES 
                    (1000.00, 'W', '2023-12-15', 1, 1, 'Transaction 1'),
                    (2000.00, 'D', '2023-12-16', 2, 2, 'Transaction 2');`
        }
    ]
};
