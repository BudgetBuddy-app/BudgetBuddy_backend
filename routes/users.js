const express = require('express');
const router = express.Router();

const db = require('../public/javascripts/db.js');


//TODO GET users listing
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//TODO hash passwords when creating user
//TODO make CRUD for user

module.exports = router;
