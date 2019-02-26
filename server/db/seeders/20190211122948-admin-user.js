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
      },
      {
        id: uuid(),
        username: 'biola Balogun',
        email: 'balogunbiola101@gmail.com',
        password: baseHelpers.hashPassword('customer24'),
        isVerified: true,
        role: 'superAdmin',
        createdAt: '2019-02-11 14:35:51.434+01',
        updatedAt: '2019-02-11 14:35:51.434+01'
      },
      {
        id: uuid(),
        username: 'biola',
        email: 'balogun.akeem.abiola@gmail.com',
        password: baseHelpers.hashPassword('customer24'),
        isVerified: true,
        role: 'superAdmin',
        createdAt: '2019-02-11 17:35:51.434+01',
        updatedAt: '2019-02-11 19:35:51.434+01'
      },
      {
        id: uuid(),
        username: 'akeem',
        email: 'biola@gmail.com',
        password: baseHelpers.hashPassword('customer24'),
        isVerified: true,
        role: 'superAdmin',
        createdAt: '2019-02-11 17:35:51.434+01',
        updatedAt: '2019-02-11 19:35:51.434+01'
      },
      {
        id: uuid(),
        username: 'balogun',
        email: 'balogun@gmail.com',
        password: baseHelpers.hashPassword('customer24'),
        isVerified: true,
        role: 'superAdmin',
        createdAt: '2019-02-11 17:35:51.434+01',
        updatedAt: '2019-02-11 19:35:51.434+01'
      }
    ],
    {}
  ),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
