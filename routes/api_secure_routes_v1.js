var express = require('express');
var router = express.Router();

router.get('/user-details', function (req, res, next) {
  let data = {
    name:'harshil',
    age:27,
    gender:"male"
  }
  helpers.response('OK',true,'okay',data,"encrypt")
});

module.exports = router;
