// models/admin.js
const bcrypt = require('bcrypt');
const saltRounds = process.env.BCRYPT_SALT ? parseInt(process.env.BCRYPT_SALT, 10) : 10;

module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    "Admin",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          // isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      tableName: "Admins",
      timestamps: true,
      hooks: {
        beforeBulkUpdate: async (options) => {
          if (options.attributes.password) {
            const hashedPassword = await bcrypt.hash(options.attributes.password, saltRounds);
            options.attributes.password = hashedPassword;
          }
        },
        beforeCreate: async (admin) => {
          admin.password = await bcrypt.hash(admin.password, saltRounds);
        }
      },
    }
  );

  Admin.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  return Admin;
};
