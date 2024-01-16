const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const db = require('../public/javascripts/db.js');

router.post('/', function (req, res) {
  const sql = "INSERT INTO accounts (user_id, name) VALUES (?, ?)";
  db.query(sql, [req.body.user_id, req.body.name], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      res.status(201).send('Account created');
    }
  })
});

router.get('/user/:id', function (req, res) {
  const accountId = req.params.id;
  const sql = `SELECT accounts.id, accounts.name, SUM(transactions.amount) AS total_amount 
              FROM accounts 
              LEFT JOIN transactions ON transactions.account_id = accounts.id 
              WHERE accounts.user_id = ? 
              GROUP BY accounts.id`;
  db.query(sql, [accountId], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      res.status(200).json(data);
    }
  });
});

router.get('/:id', function (req, res) {
  const accountId = req.params.id;
  const sql = "SELECT * FROM accounts WHERE id = ?";
  db.query(sql, [accountId], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      res.status(200).json(data[0]);
    }
  });
});

router.put('/:id', function (req, res) {
  const accountId = req.params.id;
  const sql = "UPDATE accounts SET name = ? WHERE id = ?";
  db.query(sql, [req.body.name, accountId], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      res.status(200).json(data);
    }
  });
});

//TODO test this when you delete an account, all of the transactions should be left without account
// account is associated with the user, not transaction, setting transaction without account desociates it from the user
//so maybe just delete them, but give the iser a warning on the frontend
router.delete('/:id', (req, res) => {
  const accountId = req.params.id;

  let sql = "UPDATE transactions SET account_id = NULL WHERE account_id = ?"
  db.query(sql, [accountId], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      console.log("transactions updated succefully!\n deleting account...")
    }
  });

  sql = "DELETE FROM accounts WHERE id = ?";
  db.query(sql, [accountId], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      res.status(200).json(data);
    }
  });
});


router.get('/statistics/user/:id', function (req, res) {
  const accountId = req.params.id;

  //total spent per month on each account
  const sql = `SELECT 
                  a.name AS account_name,
                  EXTRACT(YEAR FROM t.date) AS year,
                  EXTRACT(MONTH FROM t.date) AS month,
                  SUM(t.amount) AS transactionSum
                FROM Users u
                JOIN Accounts a ON u.id = a.user_id
                JOIN Transactions t ON a.id = t.account_id
                WHERE u.id = ?
                GROUP BY a.name, year, month
                ORDER BY year, month, a.name`;
  db.query(sql, [accountId], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      res.status(200).json(data);
    }
  });
});

module.exports = router;
