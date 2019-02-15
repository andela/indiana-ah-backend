export default (sequelize, DataTypes) => {
  const CommentEditHistory = sequelize.define(
    'CommentEditHistory',
    {
      id: {
        type: DataTypes.UUIDV4
      },
      commentId: {
        type: DataTypes.UUID
      },
      commentBody: {
        type: DataTypes.STRING
      }
    },
    { paranoid: true }
  );
  CommentEditHistory.associate = (models) => {
    CommentEditHistory.belongsTo(models.Comments, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
  };
  return CommentEditHistory;
};
