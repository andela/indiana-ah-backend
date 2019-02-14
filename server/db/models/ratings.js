export default (sequelize, DataTypes) => {
  const Ratings = sequelize.define(
    'Ratings',
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID
      },
      userId: { type: DataTypes.UUID },
      articleId: { type: DataTypes.UUID },
      rating: { type: DataTypes.INTEGER, allowNull: false }
    },
    { paranoid: true }
  );
  Ratings.associate = ({ Users, Articles }) => {
    Ratings.belongsTo(Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Ratings.belongsTo(Articles, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return Ratings;
};
