const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const db = require('../public/javascripts/db.js');

router.get('/account/:id', function (req, res, next) {
  const accountId = req.params.id;
  const sql = `SELECT * FROM transactions WHERE account_id = ?`;
  db.query(sql, [accountId], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      res.status(200).json(data);
    }
  });
});

router.get('/:id', function (req, res, next) {
  const accountId = req.params.id;
  const sql = `SELECT * FROM accounts WHERE id = ?`;
  db.query(sql, [accountId], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      res.status(200).json(data[0]);
    }
  });
});

router.get('/user/:id', function (req, res, next) {

  const userId = req.params.id;
  const sql = `SELECT transactions.*
                FROM transactions
                JOIN accounts ON transactions.account_id = accounts.id
                WHERE accounts.user_id = ?;`;
  db.query(sql, [userId], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      res.status(200).json(data);
    }
  });
});

router.post('/', function (req, res, next) {
  const sql = `INSERT INTO transactions
                (amount, date, recipient, account_id, notes) 
                VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [req.body.amount, req.body.date, req.body.recipient, req.body.account_id, req.body.notes], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      res.status(201).send('Transaction created');
    }
  })
});

router.put('/:id', function (req, res) {
  const transactionId = req.params.id;
  const sql = `UPDATE transactions 
                SET amount = ?, date = ?, recipient = ?, account_id = ?, notes = ? 
                WHERE id = ?`;
  db.query(sql, [req.body.amount, req.body.date, req.body.recipient, req.body.account_id, req.body.notes, transactionId], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      res.status(200).json(data);
    }
  });
});

router.delete('/:id', (req, res) => {
  const transactionId = req.params.id;
  const sql = `DELETE FROM transactions WHERE id = ?`;
  db.query(sql, [transactionId], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      res.status(200).json(data);
    }
  });
});

module.exports = router;
