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
    imageUrl: {
      allowNull: true,
      type: Sequelize.STRING
    },
    numberOfRead: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    articleSlug: {
      allowNull: false,
      type: Sequelize.TEXT
    },
    tag: {
      allowNull: true,
      type: Sequelize.STRING
    },
    userId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
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
