import request from 'supertest';
import { expect } from 'chai';
import app from '../../index';
import {
  user1,
  validArticle,
  validHighlight,
  inValidHighlight,
  upDateValidHighlight,
  userAgare
} from './mockData/articlesMockData';

let verifiedToken, secondVerifiedToken, articleSlug, secondArticleSlug, highlightId;
const wrongArticleSlug = 'how-rthy-tyfghbuh';

before(async () => request(app)
  .post('/api/v1/login')
  .send({ email: user1.email, password: user1.password })
  .then((res) => {
    verifiedToken = res.body.token;
  }));

before(async () => request(app)
  .post('/api/v1/login')
  .send({ email: userAgare.email, password: userAgare.password })
  .then((res) => {
    secondVerifiedToken = res.body.token;
  }));

describe('Create an Article for comment', () => {
  it('Should create an article if the user passes authentication', () => request(app)
    .post('/api/v1/articles')
    .set('x-auth-token', verifiedToken)
    .send(validArticle)
    .then((res) => {
      articleSlug = res.body.article.slug;
      expect(res.status).to.equal(201);
      expect(res.body.article).to.be.an('object');
    }));

  it('Should create an article if the user passes authentication', () => request(app)
    .post('/api/v1/articles')
    .set('x-auth-token', secondVerifiedToken)
    .send(validArticle)
    .then((res) => {
      secondArticleSlug = res.body.article.slug;
      expect(res.status).to.equal(201);
      expect(res.body.article).to.be.an('object');
    }));
});

describe('Create an Highlight text for an Article', () => {
  it('Should not create an highlight if Article doesn\'t exist', () => request(app)
    .post(`/api/v1/articles/${wrongArticleSlug}/highlights`)
    .set('x-auth-token', verifiedToken)
    .send(validHighlight)
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Article not found');
    }));

  it('Should not create an highlight if Highlighted text doesn\'t exist in article', () => request(app)
    .post(`/api/v1/articles/${articleSlug}/highlights`)
    .set('x-auth-token', verifiedToken)
    .send(inValidHighlight)
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Highlighted text doesn\'t exist');
    }));

  it('Should create an highlight if Article exist', () => request(app)
    .post(`/api/v1/articles/${articleSlug}/highlights`)
    .set('x-auth-token', verifiedToken)
    .send(validHighlight)
    .then((res) => {
      highlightId = res.body.data.id;
      expect(res.status).to.equal(201);
      expect(res.body.message).to.equal('Highlight successful');
      expect(res.body.data).to.be.an('object');
    }));
});

describe('Update an Highlight text for an Article', () => {
  it('Should not create an highlight if Article doesn\'t exist', () => request(app)
    .patch(`/api/v1/articles/${wrongArticleSlug}/highlights`)
    .set('x-auth-token', verifiedToken)
    .send(upDateValidHighlight)
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Article not found');
    }));

  it('Should not create an highlight if Highlighted text doesn\'t exist in article', () => request(app)
    .patch(`/api/v1/articles/${secondArticleSlug}/highlights`)
    .set('x-auth-token', verifiedToken)
    .send(upDateValidHighlight)
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('No highlight on this Article');
    }));

  it('Should not create an highlight if Highlighted text doesn\'t exist in article', () => request(app)
    .patch(`/api/v1/articles/${articleSlug}/highlights`)
    .set('x-auth-token', verifiedToken)
    .send(inValidHighlight)
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Highlighted text doesn\'t exist');
    }));
  it('Should not create an highlight if Highlighted text doesn\'t exist in article', () => request(app)
    .patch(`/api/v1/articles/${articleSlug}/highlights`)
    .set('x-auth-token', verifiedToken)
    .send(inValidHighlight)
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Highlighted text doesn\'t exist');
    }));

  it('Should edit an highlight text if its the same User that created the Highlight text', () => request(app)
    .patch(`/api/v1/articles/${articleSlug}/highlights`)
    .set('x-auth-token', verifiedToken)
    .send(upDateValidHighlight)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Highlight updated successfully');
      expect(res.body.data).to.be.an('object');
    }));
});

describe('GET an Highlight text for an Article', () => {
  it('Should not get an highlight text if Article doesn\'t exist', () => request(app)
    .get(`/api/v1/articles/${wrongArticleSlug}/highlights`)
    .set('x-auth-token', verifiedToken)
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Article not found');
    }));

  it('Should not get an highlight if Highlighted text doesn\'t exist in article', () => request(app)
    .get(`/api/v1/articles/${secondArticleSlug}/highlights`)
    .set('x-auth-token', verifiedToken)
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('No highlight on this Article');
    }));

  it('Should get an highlighted text if its the same User that created the Highlight text', () => request(app)
    .get(`/api/v1/articles/${articleSlug}/highlights`)
    .set('x-auth-token', verifiedToken)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Highlight retrieved successfully');
      expect(res.body.data).to.be.an('Array');
    }));
});

describe('DELETE an Highlight text for an Article', () => {
  it('Should not delete an highlighted text if Article doesn\'t exist', () => request(app)
    .delete(`/api/v1/articles/${wrongArticleSlug}/highlights/${highlightId}`)
    .set('x-auth-token', verifiedToken)
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Article not found');
    }));

  it('Should not delete an highlight if Highlighted text doesn\'t exist in article', () => request(app)
    .delete(`/api/v1/articles/${secondArticleSlug}/highlights/${highlightId}`)
    .set('x-auth-token', verifiedToken)
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('No highlight on this Article');
    }));

  it('Should delete an highlighted text if its the same User that created the Highlight text', () => request(app)
    .delete(`/api/v1/articles/${articleSlug}/highlights/${highlightId}`)
    .set('x-auth-token', verifiedToken)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Highlight removed successfully');
    }));
});
