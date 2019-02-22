export default (sequelize, DataTypes) => {
  const CommentEditHistories = sequelize.define(
    'CommentEditHistories',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      commentId: {
        type: DataTypes.UUID
      },
      commentBody: {
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
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
