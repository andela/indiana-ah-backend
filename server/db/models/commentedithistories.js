export default (sequelize, DataTypes) => {
  const CommentEditHistories = sequelize.define(
    'CommentEditHistories',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
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
  CommentEditHistories.associate = (models) => {
    CommentEditHistories.belongsTo(models.Comments, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
  };
  return CommentEditHistories;
};
