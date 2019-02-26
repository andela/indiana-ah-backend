export default (sequelize, DataTypes) => {
  const CommentReactions = sequelize.define(
    'CommentReactions',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      userId: {
        type: DataTypes.UUID
      },
      commentId: {
        type: DataTypes.UUID
      },
      reactionType: {
        allowNull: false,
        type: DataTypes.ENUM,
        values: ['like', 'dislike']
      }

    },
    {}
  );
  CommentReactions.associate = (models) => {
    CommentReactions.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    CommentReactions.belongsTo(models.Comments, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
    CommentReactions.belongsTo(models.Comments, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
  };
  return CommentReactions;
};
