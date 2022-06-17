var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sequelize = require('./models').sequelize;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// test database conection (snippet from sequelize documentation: 'getting started')
const authenticate = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

authenticate();
sequelize.sync();

// serve static files
app.use('/static', express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404
app.use(function(req, res, next) {
  console.log('404 error handler called')
  const err = new Error();
  err.status = 404;
  err.message = 'Page not found';
  message = "Sorry! We couldn't find the page you were looking for";
  console.log(err.message);
  res.render('page-not-found', { err, title: 'Page not Found' });
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log('Global error handler called')
  if (err.status === 404) {
    res.render('page-not-found', { err, message, title: 'Page not Found' });
  } else {
    if (!err.status) {
      err.status = 500;
      err.message = 'Something went wrong'
    }

    console.log(err.status, err.message);

    // render the error page
    res.status(err.status || 500);
    res.render('error', { err, title: 'Error - ' + err.status });
  }
});

module.exports = app;
