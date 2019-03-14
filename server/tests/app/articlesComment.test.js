import request from 'supertest';
import { expect } from 'chai';
import app from '../../index';
import { user1, validArticle } from './mockData/articlesMockData';

let verifiedToken;
let articleSlug;
let articleId;
let commentId;
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
      expect(res.status).to.equal(201);
      expect(res.body.article).to.be.an('object');
    }));
});

describe('Get one article', () => {
  it('Should get an article if the article exists', () => request(app)
    .get(`/api/v1/articles/${articleSlug}`)
    .then((res) => {
      articleId = res.body.article.id;
      expect(res.status).to.equal(200);
      expect(res.body.article).to.be.an('object');
    }));
});

describe('User comments on an article', () => {
  it('Should show article does not exist if slug is invalid', () => request(app)
    .post(`/api/v1/articles/${wrongArticleSlug}/comments`)
    .set('x-auth-token', verifiedToken)
    .send({ commentBody: 'This is making sense part 2', articleId })
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Article not found');
    }));

  it('Should allow a verified user comment on an article', () => request(app)
    .post(`/api/v1/articles/${articleSlug}/comments`)
    .set('x-auth-token', verifiedToken)
    .send({ commentBody: 'This is making sense part 2', articleId })
    .then((res) => {
      commentId = res.body.data.id;
      expect(res.status).to.equal(201);
      expect(res.body.message).to.equal('Comment posted successfully');
    }));
});

describe('Get all article comments', () => {
  it('should return all comments for an article', () => request(app)
    .get(`/api/v1/articles/${articleSlug}/comments`)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.comments).to.be.an('array');
    }));
});

describe('Update a comment', () => {
  it('should return a "not found" response if an the comment requested to be updated was not found', () => request(app)
    .put(`/api/v1/articles/comments/${articleId}`)
    .set('x-auth-token', verifiedToken)
    .send({ commentBody: 'E no make sense again' })
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Comment not found');
    }));

  it('should return an error if an invalid UUID was entered', () => request(app)
    .put('/api/v1/articles/comments/roriie93993')
    .set('x-auth-token', verifiedToken)
    .send({ commentBody: 'E no make sense again' })
    .then((res) => {
      expect(res.status).to.equal(500);
    }));

  it('should update a comment if it was found', () => request(app)
    .put(`/api/v1/articles/comments/${commentId}`)
    .set('x-auth-token', verifiedToken)
    .send({ commentBody: 'E no make sense again' })
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Comment successfully updated');
    }));
});

describe('Get comment edit history', () => {
  it('should fetch the edit history of a particular comment', () => request(app)
    .get(`/api/v1/articles/comments/${commentId}/history`)
    .set('x-auth-token', verifiedToken)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.commentEditHistory).to.be.an('array');
    }));
});

describe('Get all article comments', () => {
  it('should return all comments for an article', () => request(app)
    .get(`/api/v1/articles/${articleSlug}/comments`)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.comments).to.be.an('array');
    }));
});

describe('delete a comment', () => {
  it('Should allow a verified user delete his/her comment', () => request(app)
    .delete(`/api/v1/comments/${commentId}`)
    .set('x-auth-token', verifiedToken)
    .send({ commentId })
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Comment deleted successfully');
    }));
});
