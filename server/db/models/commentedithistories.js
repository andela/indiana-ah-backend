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
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      commentId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      commentBody: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    { }
  );
  CommentEditHistories.associate = (models) => {
    CommentEditHistories.belongsTo(models.Comments, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
  };
  return CommentEditHistories;
};
