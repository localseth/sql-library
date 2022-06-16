var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* GET home page. */
router.get('/', async function(req, res, next) {
  const allbooks = await Book.findAll();
  res.json(allbooks);
  // res.render('index', { title: 'Express' });
});

module.exports = router;
