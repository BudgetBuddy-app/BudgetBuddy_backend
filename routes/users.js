const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();


const db = require('../public/javascripts/db.js');

router.post('/login', (req, res) => {
  const sql = "SELECT * FROM users WHERE `email` = ? and `password` = ?";
  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      const id = data[0].id;
      //TODO 300 is like 5 mins? is this in seconds?
      //make sure we don't return the password
      const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: 300 });
      return res.json({ Login: true, "token": token, "user": data });
    } else {
      return res.json("Failed");
    }
  })

})

//TODO fix return messages
router.get('/checkauth', (req, res) => {
  const token = req.headers["access-token"];
  if (!token) {
    return res.json("We need a token, please provide it");
  } else {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.json("Not authenticated");
      } else {
        req.userId = decoded.id;
        return res.json("Authenticated");
      }
    });
  }
});

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//TODO hash passwords when creating user
//make CRUD for user

module.exports = router;
