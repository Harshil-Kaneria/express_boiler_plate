// models/user.js
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const saltRounds = process.env.BCRYPT_SALT ? parseInt(process.env.BCRYPT_SALT, 10) : 10;

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isDeleted:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      tableName: "users",
      timestamps: true,
      hooks: {
        beforeBulkUpdate: async (options) => {
          if (options.attributes.password) {
            const hashedPassword = await bcrypt.hash(options.attributes.password, saltRounds);
            options.attributes.password = hashedPassword;
          }
        },
        beforeCreate: async (data) => {
          data.uuid = uuidv4()
          data.password = await bcrypt.hash(data.password, saltRounds);
        }
      },
    }
  );

  User.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};
