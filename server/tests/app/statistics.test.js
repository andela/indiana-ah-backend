import request from 'supertest';
import { expect } from 'chai';
import app from '../../index';
import { user1 } from './mockData/articlesMockData';

let verifiedToken;

before(async () => request(app)
  .post('/api/v1/login')
  .set('content-type', 'application/json')
  .send({ email: user1.email, password: user1.password })
  .then((res) => {
    verifiedToken = res.body.token;
  }));

describe('Get a user statistics', () => {
  it('should return statistics for a user', () => request(app)
    .get('/api/v1/statistics')
    .set('x-auth-token', verifiedToken)
    .then((res) => {
      expect(res.status).to.equal(200);
    }));
});
