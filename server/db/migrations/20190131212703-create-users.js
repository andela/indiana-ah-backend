export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      type: Sequelize.UUID
    },
    name: {
      allowNull: true,
      type: Sequelize.STRING
    },
    username: {
      unique: true,
      allowNull: false,
      type: Sequelize.STRING
    },
    email: {
      unique: true,
      allowNull: false,
      type: Sequelize.STRING
    },
    password: {
      allowNull: false,
      type: Sequelize.STRING
    },
    bio: {
      allowNull: true,
      type: Sequelize.STRING
    },
    role: {
      defaultValue: 'user',
      type: Sequelize.STRING
    },
    isVerified: {
      defaultValue: false,
      type: Sequelize.BOOLEAN
    },
    imageUrl: {
      defaultValue: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png',
      type: Sequelize.STRING
    },
    subscribed: {
      defaultValue: false,
      type: Sequelize.BOOLEAN
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
  down: queryInterface => queryInterface.dropTable('Users')
};
