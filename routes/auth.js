const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('../public/javascripts/db.js');

router.post('/login', (req, res) => {
    const sql = "SELECT id, name, email FROM users WHERE `email` = ? and `password` = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            return res.status(500).json({ Login: false, Message: err });
        }
        if (data.length > 0) {
            const id = data[0].id;
            const token = jwt.sign({ id }, (process.env.JWT_SECRET_KEY || "secretPsswd"), { expiresIn: '7d' });
            return res.status(200).json({ Login: true, "token": token, "User": data });
        } else {
            return res.status(401).json({ Login: false, Message: "Wrong password or email" });
        }
    })
});

router.get('/validate', (req, res) => {
    const token = req.headers["access-token"];
    if (!token) {
        return res.status(401).json("No token was provided");
    } else {
        jwt.verify(token, (process.env.JWT_SECRET_KEY || "secretPsswd"), (err, decoded) => {
            if (err) {
                return res.status(401).json({ Validation: false });
            } else {
                req.userId = decoded.id;
                const sql = "SELECT id, name, email FROM users WHERE `id` = ?";
                db.query(sql, [decoded.id], (err, data) => {
                    if (err) {
                        return res.status(500).json({ Error: err });
                    }
                    if (data.length > 0) {
                        return res.status(200).json({ Validation: true, User: data[0] });
                    } else {
                        return res.status(401).json({ Validation: false, User: null });
                    }
                });
            }
        });
    }
});

//TODO validate the token is valid on every call done to the API

module.exports = router;