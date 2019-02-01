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
        type: DataTypes.INTEGER,
        autoIncrement: true
      },
      tag: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      userId: {
        type: DataTypes.INTEGER
      },
      categoryId: {
        type: DataTypes.INTEGER
      }
    },
    {}
  );
  Articles.associate = (models) => {
    Articles.hasMany(models.Comments);
    Articles.hasMany(models.Reactions);
    Articles.hasMany(models.Reports);
    Articles.hasMany(models.Bookmarks);
  };
  return Articles;
};
