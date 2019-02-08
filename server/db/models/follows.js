export default (sequelize, DataTypes) => {
  const Follows = sequelize.define(
    'Follows',
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID
      },
      authorId: {
        type: DataTypes.UUID
      },
      followerId: {
        type: DataTypes.UUID
      }
    },
    { paranoid: true }
  );
  Follows.associate = ({ Users }) => {
    Follows.belongsTo(Users, {
      foreignKey: 'authorId',
      onDelete: 'CASCADE'
    });
    Follows.belongsTo(Users, {
      foreignKey: 'followerId',
      onDelete: 'CASCADE'
    });
  };
  return Follows;
};
