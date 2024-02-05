const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const db = require('../public/javascripts/db.js');
const { convertToLocalTimezone } = require('../utils/timeFuncs.js');

router.get('/account/:id', function (req, res, next) {
  const accountId = req.params.id;
  const sql = `SELECT transactions.*, categories.name AS category_name
              FROM transactions
              INNER JOIN categories ON transactions.category_id = categories.id
              WHERE transactions.account_id = ?`;
  db.query(sql, [accountId], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      data.forEach((item) => {
        item.date = convertToLocalTimezone(item.date)
      });
      res.status(200).json(data);
    }
  });
});

router.get('/:id', function (req, res, next) {
  const transactionId = req.params.id;
  const sql = `SELECT transactions.*, categories.name AS category_name
              FROM transactions
              INNER JOIN categories ON transactions.category_id = categories.id
              WHERE transactions.id = ?`;
  db.query(sql, [transactionId], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      data[0].date = convertToLocalTimezone(data[0].date)
      res.status(200).json(data[0]);
    }
  });
});

router.get('/user/:id', function (req, res, next) {

  const userId = req.params.id;
  sql = `SELECT transactions.*, categories.name AS category_name, accounts.name AS account_name
          FROM transactions
          JOIN accounts ON transactions.account_id = accounts.id
          JOIN categories ON transactions.category_id = categories.id
          WHERE accounts.user_id = ?;`;
  db.query(sql, [userId], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      data.forEach((item) => {
        item.date = convertToLocalTimezone(item.date)
      });
      res.status(200).json(data);
    }
  });
});

router.post('/', async function (req, res, next) {

  category_id = await getCategoryId(req.body.category)

  const sql = `INSERT INTO transactions
                (amount, date, recipient, account_id, notes, category_id) 
                VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [req.body.amount, req.body.date, req.body.recipient, req.body.account_id, req.body.notes, category_id], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      res.status(201).send('Transaction created');
    }
  })
});

router.put('/:id', async function (req, res) {

  category_id = await getCategoryId(req.body.category)

  const transactionId = req.params.id;
  const sql2 = `UPDATE transactions 
                SET amount = ?, date = ?, recipient = ?, account_id = ?, notes = ?, category_id = ?
                WHERE id = ?`;
  db.query(sql2, [req.body.amount, req.body.date, req.body.recipient, req.body.account_id, req.body.notes, category_id, transactionId], (err, data) => {
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

//aux functions
function getCategoryId(categoryName) {
  return new Promise((resolve, reject) => {
    const sql1 = `SELECT id
                 FROM categories
                 WHERE name = ?`;
    db.query(sql1, [categoryName], (err, data) => {
      if (err) {
        console.error('Database error:', err);
        reject(err);
      } else if (data.length > 0) {
        let category_id = data[0].id;
        resolve(category_id);
      } else {
        // Category does not exist, create it
        const sql2 = `INSERT INTO categories (name) VALUES (?)`;
        db.query(sql2, [categoryName], (err, data) => {
          if (err) {
            console.error('Database error:', err);
            reject(err);
          } else {
            let category_id = data.insertId;
            resolve(category_id);
          }
        });
      }
    });
  });
}

module.exports = router;
