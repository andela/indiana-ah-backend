export default (sequelize, DataTypes) => {
  const VerifyToken = sequelize.define(
    'VerifyToken',
    {
      userId: DataTypes.INTEGER,
      token: DataTypes.STRING
    },
    {}
  );
  VerifyToken.associate = ({ User }) => {
    VerifyToken.belongsTo(User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return VerifyToken;
};
