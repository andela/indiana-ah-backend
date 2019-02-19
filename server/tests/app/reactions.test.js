import request from 'supertest';
import { expect } from 'chai';
import app from '../../index';
import {
  user
} from './mockData/reactionsMockData';

import {
  validArticle,
} from './mockData/articlesMockData';

let userToken = '',
  articleSlug;

before(async () => {
  const res = await request(app)
    .post('/api/v1/login')
    .send(user);
  userToken = res.body.token;
});

describe('Create an Article', () => {
  it('create an article if the user passes authentication', () => request(app)
    .post('/api/v1/articles')
    .set('x-auth-token', userToken)
    .send(validArticle)
    .then((res) => {
      articleSlug = res.body.article.slug;
      expect(res.status).to.equal(201);
      expect(res.body.article).to.be.an('object');
    }));
});

describe('Article Likes and dislikes', () => {
  it('should return an error if user is not authenticated', () => request(app)
    .post(`/api/v1/articles/${articleSlug}/reaction`)
    .then((res) => {
      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal('Access denied. You are not authorized to access this route');
    }));
  it('should return an error if an invalid reaction is passed', () => request(app)
    .post(`/api/v1/articles/${articleSlug}/reaction`)
    .set('x-auth-token', userToken)
    .send({ reactionType: 'Awesome' })
    .then((res) => {
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('This is not an allowed reaction type');
    }));
  it('should return an error if an invalid article slug is passed', () => request(app)
    .post('/api/v1/articles/enjoying-andela/reaction')
    .set('x-auth-token', userToken)
    .send({ reactionType: 'Awesome' })
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Article not found');
    }));
  it('should successfully like an article if user is authenticated', () => request(app)
    .post(`/api/v1/articles/${articleSlug}/reaction`)
    .set('x-auth-token', userToken)
    .send({ reactionType: 'like' })
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Reaction created');
    }));
  it('should successfully dislike an article if user is authenticated', () => request(app)
    .post(`/api/v1/articles/${articleSlug}/reaction`)
    .set('x-auth-token', userToken)
    .send({ reactionType: 'dislike' })
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Reaction updated');
    }));
  it('should successfully delete a reaction if user is authenticated', () => request(app)
    .post(`/api/v1/articles/${articleSlug}/reaction`)
    .set('x-auth-token', userToken)
    .send({ reactionType: 'dislike' })
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Reaction successfully deleted');
    }));
});
