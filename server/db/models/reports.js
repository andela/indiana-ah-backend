export default (sequelize, DataTypes) => {
  const Report = sequelize.define(
    'Report',
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
          model: 'User',
          key: 'id',
          as: 'userId'
        }
      },
      articleId: {
        type: DataTypes.UUID,
        references: {
          model: 'Article',
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
  Report.associate = ({ Article, User }) => {
    Report.belongsTo(Article, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Report.belongsTo(User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Report;
};
