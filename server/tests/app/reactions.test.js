import request from 'supertest';
import { expect } from 'chai';
import app from '../../index';
import {
  user,
  like
} from './mockData/reactionsMockData';

let userToken = '';

before(async () => {
  const res = await request(app)
    .post('/api/v1/login')
    .send(user);
  userToken = res.body.token;
});

describe('Article Likes and dislikes', () => {
  it('should return an error if user is not authenticated', () => request(app)
    .post('/api/v1/:slug/reaction')
    .then((res) => {
      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal('Access denied.You are not authorized to access this route');
    }));
  it('should successfully like an article if user is authenticated', () => request(app)
    .post('/api/v1/:slug/reaction')
    .set('x-auth-token', userToken)
    .send(like)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('You have successfully liked this article');
    }));
});
