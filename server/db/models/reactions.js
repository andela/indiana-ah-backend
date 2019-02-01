'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reactions = sequelize.define('Reactions', {
    content: DataTypes.STRING,
    complete: DataTypes.BOOLEAN
  }, {});
  Reactions.associate = function(models) {
    // associations can be defined here
  };
  return Reactions;
};