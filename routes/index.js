const express = require('express');
const router = express.Router();

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

module.exports = router;
