const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

const db = require('../public/javascripts/db.js');

var multer = require('multer'); // for file handling
const upload = multer({ dest: 'uploads/' }); // Set up multer to store files in temporary directory

const { parse } = require('csv-parse');
const fs = require('fs');

router.post('/transactions/:id', upload.single('file'), async function (req, res, next) {

  const userId = req.params.id;

  //set what each row represents
  recipientRow = 0
  amountRow = 1
  dateRow = 2
  categoryNameRow = 3
  notesRow = 4
  accountNameRow = 5

  //set the first row with info
  firstRowWithData = 0

  //parse all data from the CSV file
  const file = req.file;
  let parsedData = await parseCSVData(file.path, firstRowWithData);

  // get the accountList to then submit the account ID with each transaction, if doesn't exist, create it
  let foundAccountId = -1
  let accountList = await getAccounts(userId);
  if (accountList == null) { return res.status(500).send({ error: 'error fetching accounts...' }); }

  // get the categoryList to then submit the account ID with each transaction, if doesn't exist, create it
  let foundCategoryId = -1
  let categoryList = await getCategories();
  if (categoryList == null) { return res.status(500).send({ error: 'error fetching categories...' }); }


  //TODO optimize the category and account search with hash tables or something

  //build SQl command
  console.log("building SQL command...")
  let sql = "INSERT INTO transactions(recipient, amount, date ,category_id , notes, account_id) VALUES ";
  for (let csvRow of parsedData) {
    //find the account_id of this account
    for (i = 0; i < accountList.length; i++) {
      if (accountList[i].name == csvRow[accountNameRow]) {
        foundAccountId = accountList[i].id;
        i = accountList.length;
      }
    }

    //find the category_id of this account
    for (i = 0; i < categoryList.length; i++) {
      if (categoryList[i].name == csvRow[categoryNameRow]) {
        foundCategoryId = categoryList[i].id;
        i = categoryList.length;
      }
    }

    //if the account is not yet registered, create it
    if (foundAccountId == -1) {

      let createdValue = await createNewAccount(userId, csvRow[accountNameRow]);

      if (createdValue == null) { return res.status(500).send({ error: 'error fetching accounts...' }); }

      accountList = await getAccounts(userId);
      if (accountList == null) { return res.status(500).send({ error: 'error fetching accounts...' }); }

      for (i = 0; i < accountList.length; i++) {
        if (accountList[i].name == csvRow[accountNameRow]) {
          foundAccountId = accountList[i].id;
          i = accountList.length;
        }
      }
    }

    //if the category is not yet registered, create it
    if (foundCategoryId == -1) {

      let createdValue = await createNewCategory(csvRow[categoryNameRow]);

      if (createdValue == null) { return res.status(500).send({ error: 'error fetching categories...' }); }

      categoryList = await getCategories();
      if (categoryList == null) { return res.status(500).send({ error: 'error fetching categories...' }); }

      for (i = 0; i < categoryList.length; i++) {
        if (categoryList[i].name == csvRow[categoryNameRow]) {
          foundCategoryId = categoryList[i].id;
          i = categoryList.length;
        }
      }
    }

    //add the data to the sql command
    sql += "('" + sanitize(csvRow[recipientRow]) + "', " + sanitize(csvRow[amountRow]) + ", '" + sanitize(csvRow[dateRow]) + "', '" + sanitize(foundCategoryId) +
      "', '" + sanitize(csvRow[notesRow]) + "', '" + sanitize(foundAccountId) + "'),"

    foundAccountId = -1
    foundCategoryId = -1
  }

  //remove extra comma at the end of the command
  sql = sql.substring(0, sql.length - 1);

  console.log('SQL command was built successfully, executing...');

  // Execute the query with the values
  db.query(sql, (err, data) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send({ error: 'Database error', details: err });
    }
    console.log("Import CSV SQL command ran successfully!");
  });
  return res.sendStatus(200);

});

//TODO delete /uploads file after using
function parseCSVData(filepath, firstRowWithData) {

  currentRow = 0

  console.log("parsing data from file...");
  return new Promise((resolve, reject) => {
    let parsedData = [];

    fs.createReadStream(filepath)
      .pipe(parse({ delimiter: ',', from_line: 2 }))
      .on('data', (row) => {
        if (currentRow < firstRowWithData) {
          currentRow++;
        } else {
          parsedData.push(row);
        }
      })
      .on('end', () => {
        console.log("data parsed successfully!");

        resolve(parsedData);
      })
      .on('error', (error) => {
        return reject(error.message);
      });
  })
}

function getAccounts(userId) {
  return new Promise((resolve, reject) => {
    console.log("fetching accounts...")
    let sql3 = "SELECT * FROM accounts WHERE user_id = " + userId;
    db.query(sql3, (err, data) => {
      if (err) {
        console.error('Database error:', err);
        return null;
      } else {
        console.log("accounts retrieved successfully!");
        resolve(data);
      }
    });
  });
}

function getCategories() {
  return new Promise((resolve, reject) => {
    console.log("fetching categories...")
    let sql3 = "SELECT * FROM categories";
    db.query(sql3, (err, data) => {
      if (err) {
        console.error('Database error:', err);
        return null;
      } else {
        console.log("categories retrieved successfully!");
        resolve(data);
      }
    });
  });
}

//todo we should inject the params for safety, not concat strings
function createNewAccount(userId, newAccountName) {
  return new Promise((resolve, reject) => {
    console.log("Creating new account...")
    let sql2 = "INSERT INTO accounts(user_id, name) VALUES (" + userId + ", '" + newAccountName + "')"
    db.query(sql2, (err, data) => {
      if (err) {
        console.error('Database error:', err);
        return null;
      } else {
        console.log("Account created successfully!");
        resolve(data);
      }
    });
  });
}

//todo we should inject the params for safety, not concat strings
function createNewCategory(newCategoryName) {
  return new Promise((resolve, reject) => {
    console.log("Creating new category...")
    let sql2 = "INSERT INTO categories(name) VALUES ('" + newCategoryName + "')"
    db.query(sql2, (err, data) => {
      if (err) {
        console.error('Database error:', err);
        return null;
      } else {
        console.log("Category created successfully!");
        resolve(data);
      }
    });
  });
}

function sanitize(value) {
  //replace all single quotes with doubled quotes so that SQl recognizes them as a char and not a string terminator
  if (typeof value === "string") {
    value = value.replace(/'/g, "''");
  }

  //TODO other kinds of validations stuff

  return value;
}

module.exports = router;
