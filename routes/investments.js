const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const db = require('../public/javascripts/db.js');
const { convertToLocalTimezone } = require('../utils/timeFuncs.js');

router.post('/', function (req, res) {
  const sql = `INSERT INTO investments 
  (user_id, symbol, owned_shares, average_purchase_price)
   VALUES (?, ?,?,?)`;
  db.query(sql, [req.body.user_id, req.body.symbol, req.body.owned_shares, req.body.average_purchase_price], (err, data) => {
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
  const sql = `SELECT * 
              FROM investments 
              WHERE user_id = ?`;
  db.query(sql, [accountId], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      data.forEach((item) => {
        item.last_refreshed = convertToLocalTimezone(item.last_refreshed)
      });
      res.status(200).json(data);
    }
  });
});

router.get('/:id', function (req, res) {
  const investmentID = req.params.id;
  const sql = "SELECT * FROM investments WHERE id = ?";
  db.query(sql, [investmentID], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      data[0].last_refreshed = convertToLocalTimezone(data[0].last_refreshed)
      res.status(200).json(data[0]);
    }
  });
});

router.put('/:id', function (req, res) {
  const investmentID = req.params.id;
  const sql = "UPDATE investments SET symbol = ?, owned_shares = ?, average_purchase_price = ? WHERE id = ?";
  db.query(sql, [req.body.symbol, req.body.owned_shares, req.body.average_purchase_price, investmentID], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      res.status(200).json(data);
    }
  });
});

router.put('/yahoo/:id', function (req, res) {
  const investmentID = req.params.id;

  const sql = `UPDATE investments SET last_refreshed = NOW(), name = ?, exchange = ?, currency_symbol = ?,
  price = ?, currency = ? WHERE id = ?`;
  db.query(sql, [req.body.name, req.body.exchange, req.body.currency_symbol,
  req.body.price, req.body.currency, investmentID], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      res.status(200).json(data);
    }
  });
});

router.delete('/:id', (req, res) => {
  const investmentID = req.params.id;

  sql = "DELETE FROM investments WHERE id = ?";
  db.query(sql, [investmentID], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      res.status(200).json(data);
    }
  });
});

module.exports = router;
