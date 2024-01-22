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
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                );`
        },
        {
            name: 'Categories',
            query: `CREATE TABLE IF NOT EXISTS categories(
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) UNIQUE
            );`
        },
        {
            name: 'Transactions',
            query: `CREATE TABLE IF NOT EXISTS transactions(
                id INT AUTO_INCREMENT PRIMARY KEY,
                amount DECIMAL(10, 2),
                date DATE,
                recipient VARCHAR(255),
                notes VARCHAR(255),
                account_id INT,
                category_id INT,
                FOREIGN KEY (category_id) REFERENCES categories(id),
                FOREIGN KEY (account_id) REFERENCES accounts(id)
            );`
        },
        {
            name: 'Investments',
            query: `CREATE TABLE IF NOT EXISTS investments(
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                symbol VARCHAR(255),
                last_refreshed DATE,
                name VARCHAR(255),
                exchange VARCHAR(255),
                currency_symbol VARCHAR(255),
                price DECIMAL(10, 4),
                currency VARCHAR(255),
                owned_shares DECIMAL(10, 4),
                average_purchase_price DECIMAL(10, 4),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );`
        },
        {
            name: 'InsertAdmin',
            query: `INSERT INTO users(name, email, password) VALUES 
                ('Admin 1', 'admin1@mail.com', '123');`
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
            name: 'dropInvestmentsTableQuery',
            query: `DROP TABLE IF EXISTS investments;`
        },
        {
            name: 'dropUsersTableQuery',
            query: `DROP TABLE IF EXISTS users;`
        },
        {
            name: 'dropCategoriesTableQuery',
            query: `DROP TABLE IF EXISTS categories;`
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
                    (3, 'Checking Account'),
                    (2, 'revolut'),
                    (3, 'Wise'),
                    (2, 'Cash');`
        },
        {
            name: 'Categories',
            query: `INSERT INTO categories(name) VALUES 
            ('groceries'),
            ('traveling'),
            ('entertainment'),
            ('utilities');`
        },
        {
            name: 'Transactions',
            query: `INSERT INTO transactions(amount, date, recipient, account_id, notes, category_id) VALUES 
                    (-30.00, '2023-12-19', 'Lidl', 1, 'Transaction 1', 1),
                    (140.10, '2023-12-15', 'Aldi', 1, 'Transaction 2', 3),
                    (-3480.00, '2023-12-12', 'Spar', 1, 'Transaction 3', 1),
                    (-12.02, '2023-12-11', 'Papitos', 2, 'Transaction 4', 2),
                    (100.00, '2023-12-02', 'Gray u 20', 2, 'Transaction 5', 1),
                    (-1000, '2023-12-15', 'Rossman', 2, 'Transaction 6', 2),
                    (2000.00, '2023-12-16', 'Mcdonalds', 2, 'Transaction 7', 1);`
        },
        {
            name: 'Investments',
            query: `INSERT INTO investments(user_id, symbol, last_refreshed, name, exchange, currency_symbol, price, currency, owned_shares, average_purchase_price) 
                    VALUES 
                    (1, 'VWCE.DE', '2024-01-18', 'Vanguard FTSE All-World UCITS ETF', 'GER', '€', 107.22, 'EUR', 1.2628, 102.69),
                    (1, 'VUAA.MI', '2024-01-18', 'Vanguard S&P 500 UCITS ETF', 'MIL', '€', 82.47, 'EUR', 1.1066, 79.06);`
        }
    ]
};
