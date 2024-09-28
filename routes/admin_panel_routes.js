var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { APP_SHORT_NAME: process.env.APP_SHORT_NAME, APP_NAME: process.env.APP_NAME });
});

module.exports = router;
