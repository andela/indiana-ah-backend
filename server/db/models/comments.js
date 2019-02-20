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
      slug: {
        allowNull: false,
        type: DataTypes.STRING
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
  };
  return Comments;
};
