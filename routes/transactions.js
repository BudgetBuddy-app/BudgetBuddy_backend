const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const db = require('../public/javascripts/db.js');

/*TODO post
router.post('/', function (req, res, next) {
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
*/

router.get('/account/:id', function (req, res, next) {
  const accountId = req.params.id;
  const sql = "SELECT * FROM transactions WHERE account_id = ?";
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
  const sql = "SELECT * FROM accounts WHERE id = ?";
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
