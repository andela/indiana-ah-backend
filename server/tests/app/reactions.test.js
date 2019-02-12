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
  articleId,
  articleSlug;
  user,
  like;

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
      articleId = res.body.article.id;
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
  it('should successfully like an article if user is authenticated', () => request(app)
    .post(`/api/v1/articles/${articleSlug}/reaction`)
    .set('x-auth-token', userToken)
    .send({ articleId, reactionType: 'like' })
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('You have successfully liked this article');
    }));
  it('should successfully dislike an article if user is authenticated', () => request(app)
    .post(`/api/v1/articles/${articleSlug}/reaction`)
    .set('x-auth-token', userToken)
    .send({ articleId, reactionType: 'dislike' })
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('You have successfully disliked this article');
    }));
});
