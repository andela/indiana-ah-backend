export default {
  up: (queryInterface, Sequelize) => queryInterface
    .createTable('VerifyTokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'cascade',
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId'
        }
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
    .then(() => {
      console.log('verifyToken table created');
      return queryInterface.sequelize.query(`
        CREATE FUNCTION verifyToken() RETURNS TRIGGER AS $$
        BEGIN
        DELETE FROM "VerifyTokens" WHERE "userId" < 3;
        RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER expireToken
        BEFORE INSERT OR UPDATE
        ON "VerifyTokens"
        FOR EACH ROW
        EXECUTE PROCEDURE verifyToken();
    `);
    })
    .then(() => console.log('expireToken created')),
  down: queryInterface => queryInterface
    .dropTable('VerifyTokens')
    .then(() => {
      console.log('verifyToken table dropped');
      return queryInterface.sequelize.query('DROP EVENT IF EXISTS expireToken');
    })
    .then(() => console.log('expire token event dropped'))
};
