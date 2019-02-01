'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reports = sequelize.define('Reports', {
    content: DataTypes.STRING,
    complete: DataTypes.BOOLEAN
  }, {});
  Reports.associate = function(models) {
    // associations can be defined here
  };
  return Reports;
};