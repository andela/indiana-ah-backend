import request from 'supertest';
import { expect } from 'chai';
import app from '../../index';
import { user1 } from './mockData/articlesMockData';

let userToken = '';

before(async () => {
  const res = await request(app)
    .post('/api/v1/login')
    .send(user1);
  userToken = res.body.token;
});

describe('Delete a profile', () => {
  it('delete the user\'s profile if the user passes authentication', () => request(app)
    .delete(`/api/v1/profiles/${user1.username}/delete`)
    .set('x-auth-token', userToken)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Profile successfully deleted');
    }));
  it('should delete articles created by the deleted user', () => request(app)
    .get('/api/v1/articles/how-i-got-into-andela')
    .set('x-auth-token', userToken)
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Article not found');
    }));
});
