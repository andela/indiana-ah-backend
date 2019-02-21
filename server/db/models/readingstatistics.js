export default (sequelize, DataTypes) => {
  const readingstatistics = sequelize.define(
    'readingstatistics',
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID
      },
      articleId: {
        type: DataTypes.UUID
      },
      userId: {
        type: DataTypes.UUID
      }
    },
    {}
  );
  readingstatistics.associate = ({ Users, Articles }) => {
    readingstatistics.belongsTo(Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    readingstatistics.belongsTo(Articles, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return readingstatistics;
};
