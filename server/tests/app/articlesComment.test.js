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

describe('Get one article', () => {
  it('should get an if the article exists', () => request(app)
    .get(`/api/v1/articles/${articleSlug}`)
    .then((res) => {
      articleId = res.body.article.id;
      expect(res.status).to.equal(200);
      expect(res.body.article).to.be.an('object');
    }));
});

describe('User Comment an article', () => {
  it('It should show article does not exist if slug is invalid', () => request(app)
    .post(`/api/v1/articles/${wrongArticleSlug}/comments`)
    .set('x-auth-token', verifiedToken)
    .send({ commentBody: 'THIs is making sense part 2', articleId })
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Article not found');
    }));

  it('A verified user should be able to comment on an article', () => request(app)
    .post(`/api/v1/articles/${articleSlug}/comments`)
    .set('x-auth-token', verifiedToken)
    .send({ commentBody: 'THIs is making sense part 2', articleId })
    .then((res) => {
      expect(res.status).to.equal(201);
      expect(res.body.message).to.equal('Comment has been posted successfully');
    }));
});
