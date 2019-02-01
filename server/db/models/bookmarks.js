module.exports = (sequelize, DataTypes) => {
  const Bookmarks = sequelize.define(
    'Bookmarks',
    {
      id: {
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      articleId: {
        type: DataTypes.INTEGER
      },
      userId: {
        type: DataTypes.INTEGER
      }
    },
    {}
  );
  Bookmarks.associate = ({ Users, Article }) => {
    Bookmarks.belongsTo(Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Bookmarks.belongsTo(Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return Bookmarks;
};
