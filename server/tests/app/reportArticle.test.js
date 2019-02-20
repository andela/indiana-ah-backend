import request from 'supertest';
import { expect } from 'chai';
import app from '../../index';
import { user1, validArticle } from './mockData/articlesMockData';

let verifiedToken;
let adminVerifiedToken;
let articleSlug;
let articleId;
const wrongArticleSlug = 'how-rthy-tyfghbuh';

before(async () => request(app)
  .post('/api/v1/login')
  .send({ email: user1.email, password: user1.password })
  .then((res) => {
    verifiedToken = res.body.token;
  }));

before(async () => request(app)
  .post('/api/v1/login')
  .send({ email: process.env.SUPER_ADMIN_EMAIL, password: process.env.SUPER_ADMIN_PASSWORD })
  .then((res) => {
    adminVerifiedToken = res.body.token;
  }));

describe('Create an Article for comment', () => {
  it('Should create an article if the user passes authentication', () => request(app)
    .post('/api/v1/articles')
    .set('x-auth-token', verifiedToken)
    .send(validArticle)
    .then((res) => {
      articleSlug = res.body.article.slug;
      articleId = res.body.article.id;
      expect(res.status).to.equal(201);
      expect(res.body.article).to.be.an('object');
    }));
});

describe('Admin Should get all report on an article', () => {
  it('Should get all reports on an article', () => request(app)
    .get('/api/v1/reports')
    .set('x-auth-token', adminVerifiedToken)
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('No reports found');
    }));
});

describe('User report on an article', () => {
  it('Should show article does not exist if slug is invalid', () => request(app)
    .post(`/api/v1/articles/${wrongArticleSlug}/comments`)
    .set('x-auth-token', verifiedToken)
    .send({ commentBody: 'This is making sense part 2', articleId })
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Article not found');
    }));

  it('Should allow a verified user report an article that violate Author Haven terms and conditions', () => request(app)
    .post(`/api/v1/articles/${articleSlug}/reports`)
    .set('x-auth-token', verifiedToken)
    .send({ reportBody: 'This article is gender biased', articleId })
    .then((res) => {
      expect(res.status).to.equal(201);
      expect(res.body.message).to.equal('Article reported successfully');
    }));
});

describe('Admin Should get a report on an article', () => {
  it('Should not get a report on an article', () => request(app)
    .get(`/api/v1/articles/${wrongArticleSlug}/reports`)
    .set('x-auth-token', adminVerifiedToken)
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('No reports found');
    }));

  it('Should get a report on an article', () => request(app)
    .get(`/api/v1/articles/${articleSlug}/reports`)
    .set('x-auth-token', adminVerifiedToken)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Reports retrieve successful');
    }));
});

describe('Admin Should get all report on an article', () => {
  it('Should get all reports on an article', () => request(app)
    .get('/api/v1/reports')
    .set('x-auth-token', adminVerifiedToken)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Reports retrieve successful');
    }));
});

describe('Welcome to Authors Haven', () => {
  it('Should welcome users to Authors Haven', () => request(app)
    .get('/')
    .set('x-auth-token', verifiedToken)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('welcome to authors haven platform');
    }));
});

describe('Welcome to Authors Haven', () => {
  it('Should throw an error if hitting wrong routes', () => request(app)
    .get('/ai')
    .set('x-auth-token', verifiedToken)
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.error).to.equal('route does not exist');
    }));
});
