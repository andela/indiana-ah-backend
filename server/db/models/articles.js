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
        type: DataTypes.TEXT
      },
      articleBody: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      imageUrl: {
        allowNull: true,
        type: DataTypes.STRING
      },
      numberOfRead: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.INTEGER
      },
      articleSlug: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      tag: {
        allowNull: true,
        type: DataTypes.STRING
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId'
        }
      }
    },
    {}
  );
  Articles.associate = ({
    Users, Comments, Reactions, Reports, Bookmarks
  }) => {
    Articles.belongsTo(Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Articles.hasMany(Comments, {
      foreignKey: 'articleId',
    });
    Articles.hasMany(Reactions, {
      foreignKey: 'articleId'
    });
    Articles.hasMany(Reports, {
      foreignKey: 'articleId'
    });
    Articles.hasMany(Bookmarks, {
      foreignKey: 'articleId'
    });
  };
  return Articles;
};
