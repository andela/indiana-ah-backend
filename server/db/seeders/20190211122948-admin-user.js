import '@babel/polyfill';
import uuid from 'uuid/v4';
import dotenv from 'dotenv';
import baseHelpers from '../../helpers/baseHelper';

dotenv.config();

export default {
  up: queryInterface => queryInterface.bulkInsert(
    'Users',
    [
      {
        id: uuid(),
        username: 'columba',
        email: process.env.SUPER_ADMIN_EMAIL,
        password: baseHelpers.hashPassword(process.env.SUPER_ADMIN_PASSWORD),
        isVerified: true,
        role: 'superAdmin',
        createdAt: '2019-02-11 14:35:51.434+01',
        updatedAt: '2019-02-11 14:35:51.434+01'
      }
    ],
    {}
  ),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
