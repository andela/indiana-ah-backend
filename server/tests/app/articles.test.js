import request from 'supertest';
import { expect } from 'chai';
import app from '../../index';
import {
  invalidArticle, validArticle, articleForUpdate, user
} from './mockData/articlesMockData';

let userToken;
let articleSlug;

describe('Create an Article', () => {
  before(() => request(app)
    .post('/api/v1/register')
    .send(user)
    .then((res) => {
      userToken = res.body.token;
    }));

  it('should return a unauthorized response message if the user provides an invalid or expired token', () => request(app)
    .post('/api/v1/articles')
    .set('x-auth-token', 'djjdjdjdjjdj')
    .send(validArticle)
    .then((res) => {
      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal(
        'Access denied. You are not authorized to access this route'
      );
    }));

  it('should return a unauthorized response message if no token was provided', () => request(app)
    .post('/api/v1/articles')
    .send(validArticle)
    .then((res) => {
      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal(
        'Access denied. You are not authorized to access this route'
      );
    }));

  it('should return a bad request error if the request body fails validation', () => request(app)
    .post('/api/v1/articles')
    .set('x-auth-token', userToken)
    .send(invalidArticle)
    .then((res) => {
      expect(res.status).to.equal(400);
      expect(res.body.message).match(/empty/);
    }));

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

describe('Get all articles', () => {
  it('should get all articles in the database', () => request(app)
    .get('/api/v1/articles')
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.articles).to.be.an('array');
    }));
});

describe('Get one article', () => {
  it('should return a not found error if the article was not found', () => request(app)
    .get('/api/v1/articles/1000')
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Article not found');
    }));

  it('should get an if the article exists', () => request(app)
    .get(`/api/v1/articles/${articleSlug}`)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.article).to.be.an('object');
    }));
});

describe('Update an article', () => {
  it('should return a not found error if an article requested for update was not found', () => request(app)
    .put('/api/v1/articles/yeah-yeah-yeah')
    .set('x-auth-token', userToken)
    .send(articleForUpdate)
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Article requested for update not found');
    }));

  it('should update the article if found', () => request(app)
    .put(`/api/v1/articles/${articleSlug}`)
    .set('x-auth-token', userToken)
    .send(articleForUpdate)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.article).to.be.an('object');
    }));
});
