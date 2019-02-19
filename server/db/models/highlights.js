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
          key: 'id'
        }
      },
      articleId: {
        required: true,
        type: DataTypes.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Articles',
          key: 'id'
        }
      },
      commentId: {
        required: true,
        type: DataTypes.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Comments',
          key: 'id'
        }
      },
      highlight: {
        required: true,
        type: DataTypes.TEXT,
        unique: false,
        allowNull: false
      }
    },
    {}
  );
  Highlight.associate = (models) => {
    Highlight.belongsTo(models.Comment, { foreignKey: 'commentId' });
    Highlight.belongsTo(models.Article, { foreignKey: 'articleId' });
  };
  return Highlight;
};
