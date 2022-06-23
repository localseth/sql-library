const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const { Op } = require('sequelize');

function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next);
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* GET home page */
router.get('/', asyncHandler( async (req, res, next) => {
  res.redirect('books');
  // res.json(allBooks);
  // res.render('index', { title: 'Express' });
}));

/* GET books page */
router.get('/books', asyncHandler( async (req, res, next) => {
  if (req.query.search !== /w*/g && Object.keys(req.query).length) {
    let { search } = req.query;
    const allBooks = await Book.findAll({
      where: {
        [Op.or]: [
          {author: {[Op.like]: `%${search}%`}},
          {title: {[Op.like]: `%${search}%`}},
          {genre: {[Op.like]: `%${search}%`}},
          {year: {[Op.like]: `%${search}%`}}
        ]
      },
    });
    const jsonBooks = allBooks.map(book => book.toJSON());
    res.render('books', { allBooks, title: `Books matching the search '${search}`, search, jsonBooks });
  } else {
    const allBooks = await Book.findAll({limit: 10, offset: 1});
    const jsonBooks = allBooks.map(book => book.toJSON());
    console.log('length of jsonBooks: ', jsonBooks.length);
    res.render('books', { allBooks, title: 'Books', jsonBooks })
  }
}));

/* GET new book form */
router.get('/books/new', asyncHandler( async (req, res, next) => {
  res.render('new-book', { book: {}, title: "Add a Book" });
}));

/* POST new book */
router.post('/books/new', asyncHandler( async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    console.log(book.toJSON());
    res.redirect('/');
  } catch (error) {
      // check for validation errors and render new-book view and pass errors
      if(error.name === 'SequelizeValidationError') {
        book = req.body;
        console.log('validation error', req.body)
        res.render('new-book', { book, errors: error.errors, title: 'New Book' });
      } else {
        throw error;
      }
    }
}));

router.get('/books/:id', asyncHandler( async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('update-book', { book, title: book.title });
  } else {
    err = new Error();
    err.status = 404;
    err.message = 'Page not found';
    message = `There is no entry for a book with the id: ${req.params.id}`
    next(err);
  }
}))

router.post('/books/:id', asyncHandler( async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  try {
    if(book){
      await book.update(req.body);
      res.redirect('/');
    }
  } catch (error) {
    // check for validation errors and render new-book view and pass errors
    if(error && error.name === 'SequelizeValidationError') {
      console.log('validation error', req.body)
      res.render('update-book', { book, errors: error.errors, title: 'New Book' });
    }
  } 
}));

// delete book
router.post('/books/:id/delete', asyncHandler( async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if(book){
    await book.destroy();
    res.redirect('/');
  }
}));



module.exports = router;
