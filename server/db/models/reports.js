export default (sequelize, DataTypes) => {
  const Reports = sequelize.define(
    'Reports',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId'
        }
      },
      articleId: {
        type: DataTypes.INTEGER,
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
      oreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Reports.belongsTo(Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Reports;
};
