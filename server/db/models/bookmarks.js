export default (sequelize, DataTypes) => {
  const Bookmarks = sequelize.define(
    'Bookmarks',
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID
      },
      articleId: {
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.UUID,
      }
    },
    { paranoid: true }
  );
  Bookmarks.associate = ({ Users, Articles }) => {
    Bookmarks.belongsTo(Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Bookmarks.belongsTo(Articles, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return Bookmarks;
};
