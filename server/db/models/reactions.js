module.exports = (sequelize, DataTypes) => {
  const Reactions = sequelize.define(
    'Reactions',
    {
      id: {
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      articleId: {
        type: DataTypes.INTEGER
      },
      userId: {
        type: DataTypes.INTEGER
      },
      reactionType: {
        type: DataTypes.STRING
      }
    },
    {}
  );
  Reactions.associate = ({ Users, Article }) => {
    Reactions.belongsTo(Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Reactions.belongsTo(Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return Reactions;
};
