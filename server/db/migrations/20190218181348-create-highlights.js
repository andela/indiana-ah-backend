export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Highlights', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    userId: {
      allowNull: false,
      type: Sequelize.UUID,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    articleId: {
      allowNull: false,
      type: Sequelize.Sequelize.UUID,
      onDelete: 'CASCADE',
      references: {
        model: 'Articles',
        key: 'id'
      }
    },
    highlight: {
      allowNull: false,
      type: Sequelize.TEXT
    },
    comment: {
      allowNull: false,
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('Highlights')
};
