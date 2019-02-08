import SequelizeSlugify from 'sequelize-slugify';

export default (sequelize, DataTypes) => {
  const Articles = sequelize.define(
    'Articles',
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID
      },
      articleTitle: {
        allowNull: false,
        type: DataTypes.STRING
      },
      articleBody: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      imageUrl: {
        allowNull: true,
        type: DataTypes.STRING
      },
      numberOfReads: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.INTEGER
      },
      slug: {
        unique: true,
        type: DataTypes.STRING
      },
      tags: {
        allowNull: true,
        type: DataTypes.STRING
      },
      userId: {
        type: DataTypes.UUID
      }
    },
    { paranoid: true }
  );
  SequelizeSlugify.slugifyModel(Articles, {
    source: ['articleTitle']
  });
  Articles.associate = ({
    Users, Comments, Reactions, Reports, Bookmarks
  }) => {
    Articles.belongsTo(Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'author'
    });
    Articles.hasMany(Comments, {
      foreignKey: 'articleId'
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
