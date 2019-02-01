'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bookmarks = sequelize.define('Bookmarks', {
    content: DataTypes.STRING,
    complete: DataTypes.BOOLEAN
  }, {});
  Bookmarks.associate = function(models) {
    // associations can be defined here
  };
  return Bookmarks;
};