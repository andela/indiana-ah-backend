export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Articles', {
    id: {
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      type: Sequelize.UUID
    },
    articleTitle: {
      allowNull: false,
      type: Sequelize.STRING
    },
    articleBody: {
      allowNull: false,
      type: Sequelize.TEXT
    },
    imageUrl: {
      allowNull: true,
      type: Sequelize.STRING
    },
    numberOfReads: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    slug: {
      allowNull: false,
      type: Sequelize.STRING
    },
    tags: {
      allowNull: true,
      type: Sequelize.STRING
    },
    userId: {
      type: Sequelize.UUID,
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
    },
    deletedAt: {
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('Articles')
};
