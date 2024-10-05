var express = require('express');
var router = express.Router();
const controllers = require('./../controllers/v1');

router.post('/user-register',controllers['user-register']);
router.get('/user-email-verify',controllers['user-email-verify']);
router.post('/user-login',controllers['user-login']);
router.post('/user-forgot-password',controllers['user-forgot-password']);
router.post('/user-update-password',controllers['user-update-password']);

module.exports = router;