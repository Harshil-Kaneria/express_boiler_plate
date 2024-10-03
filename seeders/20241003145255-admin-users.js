const bcrypt = require('bcrypt');
const saltRounds = process.env.BCRYPT_SALT ? parseInt(process.env.BCRYPT_SALT, 10) : 10;
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('admins', [
      {
        name:"Admin",
        email:"admin@admin.com",
        password:await bcrypt.hash("123456",saltRounds)
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('admins', null, {});
  },
};