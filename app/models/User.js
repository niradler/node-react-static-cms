var Sequelize = require('sequelize');

  module.exports = function (sequelize) {
    const User = sequelize.define("User", {
      email: Sequelize.STRING,
      name: Sequelize.STRING,
        password: Sequelize.STRING
    });
    return User;
};