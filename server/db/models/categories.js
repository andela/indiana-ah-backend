export default (sequelize, DataTypes) => {
  const Categories = sequelize.define(
    'Categories',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      categoryName: {
        type: DataTypes.STRING
      },
      articleId: {
        type: DataTypes.INTEGER
      }
    },
    {}
  );
  Categories.associate = (models) => {
    Categories.hasMany(models.Articles);
  };
  return Categories;
};
