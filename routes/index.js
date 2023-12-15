const express = require('express');
const router = express.Router();
const db = require('./db');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', (req, res) => {
  res.send('Got a POST request')
})

router.put('/user', (req, res) => {
  res.send('Got a PUT request at /user')
})

router.delete('/user', (req, res) => {
  res.send('Got a DELETE request at /user')
})


//SQL demo
router.get('/some-route', (req, res) => {
  db.query('SELECT * FROM some_table', (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

module.exports = router;
