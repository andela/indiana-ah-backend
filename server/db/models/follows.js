export default (sequelize, DataTypes) => {
  const Follows = sequelize.define(
    'Follows',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      authorId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId'
        }
      },
      followId: {
        type: DataTypes.INTEGER,
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
      foreignKey: 'followId',
      onDelete: 'CASCADE'
    });
  };
  return Follows;
};