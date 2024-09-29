var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

  console.log(helpers.crypto_helper());
  console.log(helpers.send_response_helper());
  console.log(middlewares.user_authentication_middleware());

  res.json({
    message:'respond with a resource'
  });
});

module.exports = router;
