export default (sequelize, DataTypes) => {
<<<<<<< HEAD
  const CommentReactions = sequelize.define('CommentReactions', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
=======
<<<<<<< HEAD
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
        type: DataTypes.STRING
      }
    },
    {}
  );
=======
  const CommentReactions = sequelize.define('CommentReactions', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
>>>>>>> feat: create comment reactions model
    userId: {
      type: DataTypes.UUID
    },
    commentId: {
      type: DataTypes.UUID
    },
    reactionType: {
      allowNull: false,
      type: DataTypes.STRING
    },
  }, {});
<<<<<<< HEAD
=======
>>>>>>> feat: create comment reactions model
>>>>>>> feat: create comment reactions model
  CommentReactions.associate = (models) => {
    CommentReactions.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    CommentReactions.belongsTo(models.Comments, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
  };
  return CommentReactions;
};
