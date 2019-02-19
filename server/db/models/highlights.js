export default (sequelize, DataTypes) => {
  const Highlight = sequelize.define(
    'Highlights',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      userId: {
        required: true,
        type: DataTypes.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId'
        }
      },
      articleId: {
        required: true,
        type: DataTypes.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Articles',
          key: 'id',
          as: 'articleId'
        }
      },
      commentId: {
        required: true,
        type: DataTypes.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Comments',
          key: 'id',
          as: 'commentId'
        }
      },
      highlight: {
        allowNull: false,
        type: DataTypes.TEXT
      }
    },
    {}
  );
  Highlight.associate = (models) => {
    Highlight.belongsTo(models.Comments, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
    Highlight.belongsTo(models.Articles, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return Highlight;
};
