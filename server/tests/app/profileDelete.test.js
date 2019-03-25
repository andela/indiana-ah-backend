import request from 'supertest';
import { expect } from 'chai';
import app from '../../index';
import { user1, validArticle } from './mockData/articlesMockData';

let userToken = '',
  articleSlug,
  articleId;

before(async () => {
  const res = await request(app)
    .post('/api/v1/login')
    .send(user1);
  userToken = res.body.token;
});

describe('Delete a profile', () => {
  it('creates an article if the user passes authentication', () => request(app)
    .post('/api/v1/articles')
    .set('x-auth-token', userToken)
    .send(validArticle)
    .then((res) => {
      articleSlug = res.body.article.slug;
      articleId = res.body.article.id;
      expect(res.status).to.equal(201);
      expect(res.body.article).to.be.an('object');
      expect(res.body.timeToRead).to.equal('Less than a minute read');
      expect(res.body.timeToRead).to.be.a('string');
    }));

  it('should allow a verified user comment on an article', () => request(app)
    .post(`/api/v1/articles/${articleSlug}/comments`)
    .set('x-auth-token', userToken)
    .send({ commentBody: 'This is making sense part 2', articleId })
    .then((res) => {
      expect(res.status).to.equal(201);
      expect(res.body.message).to.equal('Comment posted successfully');
    }));

  it('should delete the user\'s profile if the user passes authentication', () => request(app)
    .put(`/api/v1/profiles/${user1.username}`)
    .set('x-auth-token', userToken)
    .send({ password: 'baleesecret48' })
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Profile successfully deleted');
    }));

  it('should delete articles created by the deleted user', () => request(app)
    .get(`/api/v1/articles/${articleSlug}`)
    .set('x-auth-token', userToken)
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Article not found');
    }));

  it('should delete comments created by the deleted user', () => request(app)
    .get(`/api/v1/articles/${articleSlug}/comments`)
    .set('x-auth-token', userToken)
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Article not found');
    }));
});
