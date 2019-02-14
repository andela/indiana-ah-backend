export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Ratings', {
    id: {
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      type: Sequelize.UUID
    },
    userId: {
      type: Sequelize.UUID
    },
    articleId: {
      type: Sequelize.UUID
    },
    rating: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    deletedAt: {
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('Ratings')
};
