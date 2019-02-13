import request from 'supertest';
import { expect } from 'chai';
import app from '../../index';
import models from '../../db/models';
import {
  invalidArticle,
  validArticle,
  articleForUpdate,
  user1,
  user2
} from './mockData/articlesMockData';

const { Users } = models;

let verifiedToken;
let unverifiedToken;
let articleSlug;

describe('Login user and collect token', () => {
  before(async () => {
    await Users.create(user1);
    return request(app)
      .post('/api/v1/login')
      .send({ email: user1.email, password: user1.password })
      .then((res) => {
        verifiedToken = res.body.token;
      });
  });

  before(() => request(app)
    .post('/api/v1/register')
    .send(user2)
    .then((res) => {
      unverifiedToken = res.body.token;
    }));
});

describe('Create an Article', () => {
  it('should return a unauthorized response message if the user provides an invalid or expired token', () => request(app)
    .post('/api/v1/articles')
    .set('x-auth-token', 'djjdjdjdjjdj')
    .send(validArticle)
    .then((res) => {
      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal('Access denied. You are not authorized to access this route');
    }));

  it('should return a unauthorized response message if no token was provided', () => request(app)
    .post('/api/v1/articles')
    .send(validArticle)
    .then((res) => {
      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal('Access denied. You are not authorized to access this route');
    }));

  it('should return a forbidden response message if the user is not verified', () => request(app)
    .post('/api/v1/articles')
    .set('x-auth-token', unverifiedToken)
    .send(validArticle)
    .then((res) => {
      expect(res.status).to.equal(403);
      expect(res.body.message).to.equal('Access denied. You are not a verified user');
    }));

  it('should return a bad request error if the request body fails validation', () => request(app)
    .post('/api/v1/articles')
    .set('x-auth-token', verifiedToken)
    .send(invalidArticle)
    .then((res) => {
      expect(res.status).to.equal(400);
      expect(res.body.message).match(/empty/);
    }));

  it('create an article if the user passes authentication', () => request(app)
    .post('/api/v1/articles')
    .set('x-auth-token', verifiedToken)
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

  it('should get an article if it exists', () => request(app)
    .get(`/api/v1/articles/${articleSlug}`)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.article).to.be.an('object');
    }));
});

describe('Update an article', () => {
  it('should return a not found error if an article requested for update was not found', () => request(app)
    .put('/api/v1/articles/yeah-yeah-yea/update')
    .set('x-auth-token', verifiedToken)
    .send(articleForUpdate)
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Article requested for update not found');
    }));

  it('should update an article requested for update if found', () => request(app)
    .put(`/api/v1/articles/${articleSlug}/update`)
    .set('x-auth-token', verifiedToken)
    .send(articleForUpdate)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.article).to.be.an('object');
    }));
});

describe('Get all articles for a particular user', () => {
  it('should return a not found response if the user was not found', () => request(app)
    .get('/api/v1/articles/user/piriri')
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('User not found');
    }));

  it('should get all the articles written by a particular user', () => request(app)
    .get('/api/v1/articles/user/ozone4real')
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.articles).to.be.an('array');
    }));
});

describe('Delete an article', () => {
  it('should return a not found error if an article requested for delete was not found', () => request(app)
    .delete('/api/v1/articles/yeah-yeah-yeah/delete')
    .set('x-auth-token', verifiedToken)
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Article not found');
    }));

  it('should delete an article requested to be deleted if found', () => request(app)
    .delete(`/api/v1/articles/${articleSlug}/delete`)
    .set('x-auth-token', verifiedToken)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Article successfully deleted');
    }));
});
