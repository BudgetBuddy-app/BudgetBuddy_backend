const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const db = require('../public/javascripts/db.js');
const sqlQueries = require('../public/javascripts/sqlQueries.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/*DB calls*/
router.get('/create-tables', async (req, res) => {
  try {
    for (const table of sqlQueries.createTables) {
      console.log('Creating table: ' + table.name);
      await new Promise((resolve, reject) => {
        db.query(table.query, (err, results) => {
          if (err) {
            console.error('Error executing query \n', err.stack);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
    console.log("Tables created succesfully!")
    res.status(200).json("Tables created succesfully!");
  } catch (err) {
    console.error('ERROR: a table was not created \n' + err)
    res.status(500).send('ERROR: a table was not created \n' + err);
  }
});

router.get('/drop-tables', async (req, res) => {
  try {
    for (const table of sqlQueries.dropTables) {
      console.log('Dropping table: ' + table.name);
      await new Promise((resolve, reject) => {
        db.query(table.query, (err, results) => {
          if (err) {
            console.error('Error executing query \n', err.stack);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
    console.log("Tables dropped succesfully!")
    res.status(200).json("Tables dropped succesfully!");
  } catch (err) {
    console.error('ERROR: a table was not dropped \n' + err)
    res.status(500).send('ERROR: a table was not dropped \n' + err);
  }
});

router.get('/insert-dummy-data', async (req, res) => {
  try {
    for (const table of sqlQueries.insertDummyData) {
      console.log('Inserting dummy data into table: ' + table.name);
      await new Promise((resolve, reject) => {
        db.query(table.query, (err, results) => {
          if (err) {
            console.error('Error executing query \n', err.stack);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
    console.log("Tables filled succesfully!")
    res.status(200).json("Tables filled succesfully!");
  } catch (err) {
    console.error('ERROR: a table was not filled \n' + err)
    res.status(500).send('ERROR: a table was not filled \n' + err);
  }
});

module.exports = router;
