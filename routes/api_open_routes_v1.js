var express = require('express');
var router = express.Router();
const userLogin = require('./../controllers/v1/user-login')

/* GET users listing. */
router.post('/login',userLogin);

module.exports = router;
