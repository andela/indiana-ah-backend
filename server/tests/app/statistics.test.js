import request from 'supertest';
import { expect } from 'chai';
import app from '../../index';
import user from './mockData/reactionsMockData';

let verifiedToken;

before(async () => request(app)
  .post('/api/v1/login')
  .set('content-type', 'application/json')
  .send(user)
  .then((res) => {
    verifiedToken = res.body.token;
  }));

describe('Get a user statistics', () => {
  it('should return statistics for a user', () => request(app)
    .get('/api/v1/users/statistics')
    .set('x-auth-token', verifiedToken)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message.statistics).to.haveOwnProperty('reactionStat');
    }));
});
