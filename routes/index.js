const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const { Op } = require('sequelize');
const db = require('../models/index').db;

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
  // set page to 1 if query is not included in url
  if (!req.query.page) {
    req.query.page = 1;
  }
  // initiate pagination settings
  let { search, page } = req.query;
  let limit = 7;
  let offset = 0;
  offset = limit * (page - 1);
  if (req.query.search && (!/^\s+$/g.test(req.query.search)) && req.query.search && req.query.search !== '') {
    
    const { count, rows } = await Book.findAndCountAll({
      where: {
        [Op.or]: [
          {author: {[Op.like]: `%${search}%`}},
          {title: {[Op.like]: `%${search}%`}},
          {genre: {[Op.like]: `%${search}%`}},
          {year: {[Op.like]: `%${search}%`}}
        ]
      },
      offset: offset,
      limit: limit
    });
    let pages = Math.ceil(count/limit);
    console.log(Object.keys(req.query), req.query.search)
    res.render('books', { count, rows, page, pages, title: `Search library for '${search}'`, search });
  } else {
    const { count, rows } = await Book.findAndCountAll({
      offset: offset,
      limit: limit
    });
    let pages = Math.ceil(count/limit);
    console.log(rows);
    res.render('books', { count, rows, page, pages, title: 'Books' })
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
