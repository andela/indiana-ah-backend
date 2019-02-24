import request from 'supertest';
import { expect } from 'chai';
import app from '../../index';
import models from '../../db/models';
import {
  invalidArticle,
  validArticle,
  articleForUpdate,
  user1,
  user2,
  user3
} from './mockData/articlesMockData';

const { Users } = models;

let verifiedToken;
let verifiedToken2;
let unverifiedToken;
let articleSlug;
let articleId;
let ratingId;

before(async () => {
  await Users.create(user1);
  await Users.create(user3);
  return request(app)
    .post('/api/v1/login')
    .set('content-type', 'application/json')
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

before(() => request(app)
  .post('/api/v1/login')
  .send(user3)
  .then((res) => {
    verifiedToken2 = res.body.token;
  }));

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
      articleId = res.body.article.id;
      expect(res.status).to.equal(201);
      expect(res.body.article).to.be.an('object');
      expect(res.body.timeToRead).to.equal('a couple of secs');
      expect(res.body.timeToRead).to.be.a('string');
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
      expect(res.body.timeToRead).to.equal('a couple of secs');
      expect(res.body.timeToRead).to.be.a('string');
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
  it('should get all the articles written by a particular user', () => request(app)
    .get('/api/v1/articles/user/ozone4real')
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.articles).to.be.an('array');
    }));
});

describe('Rate an article', () => {
  it('should return a "bad request" response if the user enters an invalid rating', () => request(app)
    .post(`/api/v1/articles/${articleId}/ratings`)
    .set('x-auth-token', verifiedToken)
    .send({ rating: 10 })
    .then((res) => {
      expect(res.status).to.equal(400);
    }));

  it('should return a "Not found" response if the article requested to be rated was not found', () => request(app)
    .post('/api/v1/articles/69feb295-9030-4ef4-b7d7-91198a35b276/ratings')
    .set('x-auth-token', verifiedToken)
    .send({ rating: 5 })
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Article not found');
    }));

  it('should return a "forbidden response" if the user that wants to rate the article authored it', () => request(app)
    .post(`/api/v1/articles/${articleId}/ratings`)
    .set('x-auth-token', verifiedToken)
    .send({ rating: 3 })
    .then((res) => {
      expect(res.status).to.equal(403);
      expect(res.body.message).to.equal('You cannot rate an article that you authored');
    }));

  it('should rate the article if the article was found, the rating is valid and the rater did not author the article', () => request(app)
    .post(`/api/v1/articles/${articleId}/ratings`)
    .set('x-auth-token', verifiedToken2)
    .send({ rating: 5 })
    .then((res) => {
      ratingId = res.body.articleRating.id;
      expect(res.status).to.equal(201);
      expect(res.body.articleRating).to.be.an('object');
    }));

  it('should update the article rating if the user has rated the article previously', () => request(app)
    .post(`/api/v1/articles/${articleId}/ratings`)
    .set('x-auth-token', verifiedToken2)
    .send({ rating: 4 })
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Article rating successfully updated');
    }));
});

describe('Get one article rating', () => {
  it('should return a "bad request" response if an invalid id parameter was entered', () => request(app)
    .get('/api/v1/articles/ratings/69feb295-9030-4ef4-b7d7')
    .then((res) => {
      expect(res.status).to.equal(500);
      expect(res.body.message).match(/invalid input syntax/);
    }));

  it('should return a "not found" response if the rating was not found', () => request(app)
    .get('/api/v1/articles/ratings/69feb295-9030-4ef4-b7d7-91198a35b276')
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Article rating not found');
    }));

  it('should return the article rating if it was found', () => request(app)
    .get(`/api/v1/articles/ratings/${ratingId}`)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.articleRating).to.be.an('object');
    }));
});

describe('Get all article ratings', () => {
  it('should return a "not found" error if no ratings was found for an article', () => request(app)
    .get('/api/v1/articles/69feb295-9030-4ef4-b7d7-91198a35b276/ratings')
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('No ratings found for this article');
    }));

  it('should get all ratings for an article if any', () => request(app)
    .get(`/api/v1/articles/${articleId}/ratings`)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.articleRatings).to.be.an('array');
      expect(res.body.averageRating).to.be.a('number');
    }));
});

describe('cancel an article rating', () => {
  it('should return a "not found" error if the rating requested to be cancelled is not found', () => request(app)
    .delete('/api/v1/articles/ratings/69feb295-9030-4ef4-b7d7-91198a35b276/cancel')
    .set('x-auth-token', verifiedToken)
    .then((res) => {
      expect(res.status).to.equal(404);
    }));

  it('should cancel the rating if the rating was found', () => request(app)
    .delete(`/api/v1/articles/ratings/${ratingId}/cancel`)
    .set('x-auth-token', verifiedToken2)
    .then((res) => {
      expect(res.status).to.equal(200);
    }));
});

describe('Search all articles', () => {
  it('should return a "bad request" response if an invalid search parameter was used in the request', () => request(app)
    .get('/api/v1/articles/search?company=andela')
    .then((res) => {
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Invalid search parameter');
    }));

  it('should fetch all matching articles if found', () => request(app)
    .get('/api/v1/articles/search?q=Andela')
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.searchResults).to.be.an('array');
    }));

  it('should fetch all matching articles if the search parameters are valid and matching articles were found', () => request(app)
    .get('/api/v1/articles/search?tag=yes&articleTitle=Andela')
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.searchResults).to.be.an('array');
    }));
});

describe('Delete an article', () => {
  it('should return a "not found" response if an article requested for delete was not found', () => request(app)
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
