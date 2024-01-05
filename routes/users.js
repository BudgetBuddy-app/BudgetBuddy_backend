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

//TODO hash passwords when creating user

module.exports = router;
