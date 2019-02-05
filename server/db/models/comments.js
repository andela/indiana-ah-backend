export default (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID
      },
      userId: {
        type: DataTypes.UUID,
        references: {
          model: 'User',
          key: 'id',
          as: 'userId'
        }
      },
      articleId: {
        type: DataTypes.UUID,
        references: {
          model: 'Article',
          key: 'id',
          as: 'articleId'
        }
      },
      commentBody: {
        allowNull: true,
        type: DataTypes.STRING
      }
    },
    {}
  );
  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Comment.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return Comment;
};
