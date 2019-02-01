import dotenv from 'dotenv';

dotenv.config();

const config = {
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

export default config;
