import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID
      },
      name: {
        allowNull: true,
        type: DataTypes.STRING
      },
      username: {
        unique: true,
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
      bio: {
        allowNull: true,
        type: DataTypes.STRING
      },
      role: {
        defaultValue: 'user',
        type: DataTypes.STRING
      },
      imageUrl: {
        defaultValue: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png',
        type: DataTypes.STRING
      },
      isVerified: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
      },
      subscribed: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
      }
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          const saltRounds = 10;
          user.dataValues.password = await bcrypt.hash(user.dataValues.password, saltRounds);
          return user;
        },
        beforeBulkUpdate: async (user) => {
          const saltRounds = 10;
          if (user.password) {
            user.attributes.password = await bcrypt.hash(user.attributes.password, saltRounds);
          }
          return user;
        }
      }
    }
  );

  Users.prototype.validatePassword = function validatePassword(passwordInput) {
    return bcrypt.compare(passwordInput, this.dataValues.password);
  };

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
