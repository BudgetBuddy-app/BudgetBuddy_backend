const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const db = require('../public/javascripts/db.js');

router.get('/user/:id', function (req, res) {
  const accountId = req.params.id;
  const sql = `SELECT DISTINCT c.name
                FROM users u
                JOIN accounts a ON u.id = a.user_id
                JOIN transactions t ON a.id = t.account_id
                JOIN categories c ON t.category_id = c.id
                WHERE u.id = 1`;
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