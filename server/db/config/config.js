import dotenv from 'dotenv';

dotenv.config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL_DEV,
    dialect: 'postgres'
  },
  test: {
    url: process.env.DATABASE_URL_TEST,
    dialect: 'postgres'
  },
  production: {
    dialect: 'postgres'
  }
};
