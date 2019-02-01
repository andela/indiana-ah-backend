export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Articles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    articleTitle: {
      allowNull: false,
      type: Sequelize.STRING
    },
    articleBody: {
      allowNull: false,
      type: Sequelize.STRING
    },
    numberOfRead: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    articleSlug: {
      allowNull: false,
      type: Sequelize.TEXT,
      autoIncrement: true
    },
    tag: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId'
      }
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
  down: queryInterface => queryInterface.dropTable('Articles')
};
