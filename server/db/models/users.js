export default (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      email: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING
      },
      role: {
        allowNull: false,
        type: DataTypes.STRING
      },
      isVerified: {
        allowNull: false,
        type: DataTypes.BOOLEAN
      },
      subscribed: {
        allowNull: false,
        type: DataTypes.BOOLEAN
      }
    },
    {}
  );
  Users.associate = (models) => {
    Users.hasMany(models.Articles);
    Users.hasMany(models.Comments);
    Users.hasMany(models.Reactions);
    Users.hasMany(models.Follows);
    Users.hasMany(models.Bookmarks);
  };
  return Users;
};
