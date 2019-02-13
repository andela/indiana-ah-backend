import request from 'supertest';
import { expect } from 'chai';
import app from '../../index';
import models from '../../db/models';

const { Users } = models;
let userToken, commentId, articleSlug = '';
const user = {
  username: 'bakori_badt_guy',
  email: 'bakori@gmail.com',
  password: 'bakoripass48',
  isVerified: true
};
const article = {
  articleTitle: 'My first article',
  articleBody: 'Bakori is the man of the year'
};
const comment = {
  commentBody: 'Bakori, you are a boss'
};

before(async () => {
  await Users.create(user);
  return request(app)
    .post('/api/v1/login')
    .send({ email: user.email, password: user.password })
    .then((res) => {
      userToken = res.body.token;
    });
});
describe('Create an article', () => {
  it('create an article if the user passes authentication', () => request(app)
    .post('/api/v1/articles')
    .set('x-auth-token', userToken)
    .send(article)
    .then((res) => {
      articleSlug = res.body.article.slug;
      expect(res.status).to.equal(201);
      expect(res.body.article).to.be.an('object');
    }));
});

describe('Create a comment', () => {
  it('create a comment if the user passes authentication', () => request(app)
    .post(`/api/v1/articles/${articleSlug}/comments`)
    .set('x-auth-token', userToken)
    .send(comment)
    .then((res) => {
      commentId = res.body.data.id;
      expect(res.status).to.equal(201);
      expect(res.body.data).to.be.an('object');
    }));
});

describe('Like and Dislike comments', () => {
  it('should return an error if user is not authenticated', () => request(app)
    .post('/api/v1/comments/reaction')
    .then((res) => {
      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal('Access denied. You are not authorized to access this route');
    }));
  it('should successfully like an article if user is authenticated', () => request(app)
    .post('/api/v1/comments/reaction')
    .set('x-auth-token', userToken)
    .send({ commentId, reactionType: 'like' })
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('You have successfully liked');
    }));
  it('should successfully dislike an article if user is authenticated', () => request(app)
    .post('/api/v1/comments/reaction')
    .set('x-auth-token', userToken)
    .send({ commentId, reactionType: 'dislike' })
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('You have successfully disliked');
    }));
});
