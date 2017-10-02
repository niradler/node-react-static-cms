var Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const User = sequelize.define("User", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: Sequelize.STRING,
    name: Sequelize.STRING,
    password: Sequelize.STRING,
    updatedAt: Sequelize.DATE,
    createdAt: Sequelize.DATE,

  });
  return User;
};