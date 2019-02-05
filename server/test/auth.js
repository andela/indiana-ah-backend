import request from 'supertest';
import { expect } from 'chai';

import app from '../index';

const user1 = {
  name: 'balee',
  username: 'balee',
  email: 'balee@gmail.com',
  password: 'baleesecret',
  bio: "i am dozie's guy",
  role: 'user',
  imageUrl: 'image image',
  isVerified: false,
  subscribed: false
};

let userToken = '';

describe('user registration', () => {
  it('should register new user', () => {
    request(app)
      .post('/api/v1/register')
      .send(user1)

      .then((res) => {
        expect(res.status).to.equal(201);
        expect(res.body.message).to.equal('successfully registered to authors haven');
        userToken = res.header['x-auth-token'];
      });
  });
});
