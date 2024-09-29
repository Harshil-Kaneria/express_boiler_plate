var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  let data = {
    name:'harshil',
    age:27,
    gender:"male"
  }
  helpers.response(res,'OK',true,'okay',data,"encrypt")
});

module.exports = router;
