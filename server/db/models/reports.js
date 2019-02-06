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
<<<<<<< HEAD
        type: DataTypes.UUID
      },
      articleId: {
        type: DataTypes.UUID
=======
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
>>>>>>> chore: write test for article model
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
