export default (sequelize, DataTypes) => {
  const Comments = sequelize.define(
    'Comments',
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID
      },
      userId: {
        type: DataTypes.UUID
      },
      articleId: {
        type: DataTypes.UUID
      },
      commentBody: {
        allowNull: false,
        type: DataTypes.STRING
      }
    },
    { paranoid: true }
  );
  Comments.associate = (models) => {
    Comments.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Comments.belongsTo(models.Articles, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
    Comments.hasMany(models.CommentReactions, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
    Comments.hasMany(models.CommentEditHistories, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
  };
  return Comments;
};
