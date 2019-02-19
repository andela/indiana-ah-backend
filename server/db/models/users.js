import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

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
        type: DataTypes.ENUM,
        values: ['user', 'superAdmin', 'admin']
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
      paranoid: true,
      hooks: {
        beforeCreate: async (user) => {
          const saltRounds = 10;
          user.dataValues.password = await bcrypt.hash(user.dataValues.password, saltRounds);
          return user;
        },
        beforeBulkUpdate: async (user) => {
          const saltRounds = 10;
          if (user.attributes.password) {
            user.attributes.password = await bcrypt.hash(user.attributes.password, saltRounds);
          }
          return user;
        },
        beforeBulkDestroy: async (user) => {
          const { username } = user.where;
          const deletedUser = await sequelize.models.Users.findOne({
            where: { username },
            raw: true
          });
          const { id } = deletedUser;
          let { models } = sequelize;
          delete models.Users;
          models = Object.values(models);
          // eslint-disable-next-line array-callback-return
          return models.map((model) => {
            if (model === sequelize.models.Follows) {
              model.destroy({
                where: {
                  [Op.or]: [{ authorId: id }, { followerId: id }]
                }
              });
            } else {
              model.destroy({ where: { userId: id } });
            }
          });
        }
      }
    }
  );

  Users.prototype.validatePassword = function validatePassword(passwordInput) {
    return bcrypt.compare(passwordInput, this.dataValues.password);
  };

  Users.associate = ({
    Articles,
    Comments,
    Reactions,
    Follows,
    Bookmarks,
    Reports,
    Ratings,
    Highlights
  }) => {
    Users.hasMany(Articles, {
      foreignKey: 'userId',
    });
    Users.hasMany(Comments, {
      foreignKey: 'userId',
    });
    Users.hasMany(Reactions, {
      foreignKey: 'userId',
    });
    Users.hasMany(Follows, {
      foreignKey: 'followerId',
      as: 'followerDetails'
    });
    Users.hasMany(Follows, {
      foreignKey: 'authorId',
      as: 'authorDetails'
    });
    Users.hasMany(Bookmarks, {
      foreignKey: 'userId',
    });
    Users.hasMany(Reports, {
      foreignKey: 'userId',
    });
    Users.hasMany(Ratings, {
      foreignKey: 'userId',
    });
    Users.hasMany(Highlights, {
      foreignKey: 'userId'
    });
  };
  return Users;
};
