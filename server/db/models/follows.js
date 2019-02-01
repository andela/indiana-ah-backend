'use strict';
module.exports = (sequelize, DataTypes) => {
  const Follows = sequelize.define('Follows', {
    content: DataTypes.STRING,
    complete: DataTypes.BOOLEAN
  }, {});
  Follows.associate = function(models) {
    // associations can be defined here
  };
  return Follows;
};