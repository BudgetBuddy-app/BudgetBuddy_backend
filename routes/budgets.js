const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const db = require('../public/javascripts/db.js');
const { convertToLocalTimezone } = require('../utils/timeFuncs.js');

router.post('/', function (req, res) {
  const sql = "INSERT INTO budgets (name, start_date, end_date, amount, user_id) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [req.body.name, req.body.start_date, req.body.end_date, req.body.amount, req.body.user_id], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      res.status(201).send('Budget created');
    }
  })
});

router.get('/user/:id', function (req, res) {
  const accountId = req.params.id;
  const sql = "SELECT * FROM budgets WHERE user_id = ?";
  db.query(sql, [accountId], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      data.forEach((item) => {
        item.start_date = convertToLocalTimezone(item.start_date)
        item.end_date = convertToLocalTimezone(item.end_date)
      });
      res.status(200).json(data);
    }
  });
});

router.get('/:id', function (req, res) {
  const budgetId = req.params.id;
  const sql = "SELECT * FROM budgets WHERE id = ?";
  db.query(sql, [budgetId], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      data[0].start_date = convertToLocalTimezone(data[0].start_date)
      data[0].end_date = convertToLocalTimezone(data[0].end_date)
      res.status(200).json(data[0]);
    }
  });
});

router.put('/:id', function (req, res) {
  const budgetId = req.params.id;
  const sql = "UPDATE budgets SET name = ?, start_date = ?, end_date = ?, amount = ? WHERE id = ?";
  db.query(sql, [req.body.name, req.body.start_date, req.body.end_date, req.body.amount, budgetId], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      res.status(200).json(data);
    }
  });
});

router.delete('/:id', (req, res) => {
  const budgetId = req.params.id;
  let sql = "DELETE FROM budgets WHERE id = ?;"
  db.query(sql, [budgetId], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send({ error: 'Database error', details: err });
    } else {
      res.status(200).json(data);
    }
  });
});

module.exports = router;
