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
        type: DataTypes.UUID,
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId'
        }
      },
      articleId: {
        type: DataTypes.UUID,
        references: {
          model: 'Articles',
          key: 'id',
          as: 'articleId'
        }
      },
      reportBody: {
        allowNull: false,
        type: DataTypes.STRING
      }
    },
    {}
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
