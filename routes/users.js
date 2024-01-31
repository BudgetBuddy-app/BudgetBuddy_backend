const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const db = require('../public/javascripts/db.js');

router.post('/', function (req, res, next) {
  const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  db.query(sql, [req.body.name, req.body.email, req.body.password], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      res.status(201).send('User created');
    }
  })
});

router.put('/:id', function (req, res) {
  const accountId = req.params.id;
  const { name, email, password } = req.body;
  let sql = '';

  if (password) {
    sql = "UPDATE users SET password = ? WHERE id = ?";
  } else {
    sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
  }

  const values = password ? [password, accountId] : [name, email, accountId];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      res.status(200).json(data);
    }
  });
});

router.delete('/:id', (req, res) => {
  const accountId = req.params.id;

  let sql = "DELETE FROM transactions WHERE account_id IN (SELECT id FROM accounts WHERE user_id = ?)";
  db.query(sql, [accountId], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
      return;
    }
  });

  sql = "DELETE FROM users WHERE id = ?";
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