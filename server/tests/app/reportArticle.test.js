import request from 'supertest';
import { expect } from 'chai';
import app from '../../index';
import { user1, validArticle } from './mockData/articlesMockData';

let verifiedToken;
let articleSlug;
let articleId;
const wrongArticleSlug = 'how-rthy-tyfghbuh';

before(async () => request(app)
  .post('/api/v1/login')
  .send({ email: user1.email, password: user1.password })
  .then((res) => {
    verifiedToken = res.body.token;
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
      expect(res.body.message).to.equal('Article report is successful');
    }));
});
