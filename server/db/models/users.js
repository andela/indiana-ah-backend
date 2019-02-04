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
      username: {
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
      bio: {
        allowNull: true,
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
        defaultValue: false,
        type: DataTypes.BOOLEAN
      },
      subscribed: {
        allowNull: true,
        type: DataTypes.BOOLEAN
      }
    },
    {}
  );
  Users.associate = ({
    Articles, Comments, Reactions, Follows, Bookmarks, Reports
  }) => {
    Users.hasMany(Articles, {
      foreignKey: 'userId'
    });
    Users.hasMany(Comments, {
      foreignKey: 'userId'
    });
    Users.hasMany(Reactions, {
      foreignKey: 'userId'
    });
    Users.hasMany(Follows, {
      foreignKey: 'userId'
    });
    Users.hasMany(Bookmarks, {
      foreignKey: 'userId'
    });
    Users.hasMany(Reports, {
      foreignKey: 'userId'
    });
  };
  return Users;
};
