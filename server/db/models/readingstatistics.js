export default (sequelize, DataTypes) => {
  const readingstatistics = sequelize.define(
    'readingstatistics',
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID
      },
      articleId: {
        type: DataTypes.UUID
      },
      userId: {
        type: DataTypes.UUID
      }
    },
    {}
  );
  readingstatistics.associate = ({
    Users, Articles, Reactions, Bookmarks, Comments
  }) => {
    readingstatistics.belongsTo(Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    readingstatistics.belongsTo(Articles, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
    readingstatistics.belongsTo(Reactions, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    readingstatistics.belongsTo(Bookmarks, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    readingstatistics.belongsTo(Comments, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return readingstatistics;
};
