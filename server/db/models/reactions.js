export default (sequelize, DataTypes) => {
  const Reactions = sequelize.define(
    'Reactions',
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID
      },
      articleId: {
        type: DataTypes.UUID
      },
      userId: {
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
  Reactions.associate = ({ Users, Articles }) => {
    Reactions.belongsTo(Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Reactions.belongsTo(Articles, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return Reactions;
};
