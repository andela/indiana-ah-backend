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
        allowNull: true,
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
      imageUrl: {
        allowNull: true,
        type: DataTypes.STRING
      },
      isVerified: {
        allowNull: true,
        type: DataTypes.BOOLEAN
      },
      subscribed: {
        allowNull: true,
        type: DataTypes.BOOLEAN
      }
    },
    {}
  );
  Users.associate = (models) => {
    Users.hasMany(models.Articles, {
      foreignKey: 'userId'
    });
    Users.hasMany(models.Comments, {
      foreignKey: 'userId'
    });
    Users.hasMany(models.Reactions, {
      foreignKey: 'userId'
    });
    Users.hasMany(models.Follows, {
      foreignKey: 'userId'
    });
    Users.hasMany(models.Bookmarks, {
      foreignKey: 'userId'
    });
    Users.hasMany(models.Reports, {
      foreignKey: 'userId'
    });
  };
  return Users;
};
