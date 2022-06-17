var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.redirect('books');
  // res.json(allBooks);
  // res.render('index', { title: 'Express' });
});

router.get('/books', async function(req, res, next) {
  const allBooks = await Book.findAll();
  res.render('books', { allBooks, title: 'Books' })
});

router.get('/books/new', async function (req, res, next) {
  res.render('new');
})

module.exports = router;
