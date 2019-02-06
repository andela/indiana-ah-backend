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
        type: DataTypes.UUID,
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId'
        }
      },
      articleId: {
        type: DataTypes.UUID,
        references: {
          model: 'Articles',
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
