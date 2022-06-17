var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const err = new Error('Serious problem!');
  err.status = 555;
  throw err;
  res.send('respond with a resource');
});

module.exports = router;
