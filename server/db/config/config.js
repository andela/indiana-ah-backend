require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL_DEV,
    dialect: 'postgres'
  },
  test: {
    dialect: 'postgres'
  },
  production: {
    dialect: 'postgres'
  }
};
