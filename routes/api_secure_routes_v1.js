var express = require('express');
var router = express.Router();
const controllers = require('./../controllers/v1');

router.get('/user-details',controllers['user-details']);
router.post('/user-update',controllers['user-update']);
router.post('/user-change-password',controllers['user-change-password']);

module.exports = router;