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
        type: DataTypes.UUID,
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId'
        }
      },
      followId: {
        type: DataTypes.UUID,
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId'
        }
      }
    },
    {}
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
