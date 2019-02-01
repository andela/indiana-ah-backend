export default (sequelize, DataTypes) => {
  const Articles = sequelize.define(
    'Articles',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      articleTitle: {
        allowNull: false,
        type: DataTypes.STRING
      },
      articleBody: {
        allowNull: false,
        type: DataTypes.STRING
      },
      numberOfRead: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      articleSlug: {
        allowNull: false,
        type: DataTypes.TEXT,
        autoIncrement: true
      },
      tag: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      userId: {
        type: DataTypes.INTEGER
      }
    },
    {}
  );
  Articles.associate = (models) => {
    Articles.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Articles.hasMany(models.Comments, {
      foreignKey: 'articleId'
    });
    Articles.hasMany(models.Reactions, {
      foreignKey: 'articleId'
    });
    Articles.hasMany(models.Reports, {
      foreignKey: 'articleId'
    });
    Articles.hasMany(models.Bookmarks, {
      foreignKey: 'articleId'
    });
  };
  return Articles;
};
