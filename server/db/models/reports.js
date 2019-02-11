export default (sequelize, DataTypes) => {
  const Reports = sequelize.define(
    'Reports',
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID
      },
      userId: {
        type: DataTypes.UUID
      },
      articleId: {
        type: DataTypes.UUID
      },
      reportBody: {
        allowNull: false,
        type: DataTypes.STRING
      }
    },
    { paranoid: true }
  );
  Reports.associate = ({ Articles, Users }) => {
    Reports.belongsTo(Articles, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Reports.belongsTo(Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Reports;
};
