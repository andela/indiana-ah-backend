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
        type: DataTypes.INTEGER,
        references: {
          model: 'Articles',
          key: 'id',
          as: 'articleId'
        }
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId'
        }
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
