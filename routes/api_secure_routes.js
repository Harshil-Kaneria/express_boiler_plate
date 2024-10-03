var express = require('express');
var router = express.Router();
const { Admin } = require('../models');

router.get('/users', async (req, res) => {

  // const admin = await Admin.create({
  //   name: 'adminUser',
  //   email: 'admin@example.com',
  //   password: '123456',
  // });

  // await Admin.update(
  //   { password: '1234567' },
  //   {
  //     where: {
  //       email: "admin@admin.com",
  //     }
  //   },
  // );

  const users = await Admin.findAll();
  res.json(users);
})

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
