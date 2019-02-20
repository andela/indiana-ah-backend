import request from 'supertest';
import { expect } from 'chai';
import app from '../../index';
import models from '../../db/models';
import { user4, validArticle } from './mockData/articlesMockData';

const { Users } = models;
let verifiedToken;
let articleId;

before(async () => {
  await Users.create(user4);
  await request(app)
    .post('/api/v1/login')
    .send({ email: user4.email, password: user4.password })
    .then((res) => {
      verifiedToken = res.body.token;
    });
});

before(async () => {
  await request(app)
    .post('/api/v1/articles')
    .set('x-auth-token', verifiedToken)
    .send(validArticle)
    .then((res) => {
      articleId = res.body.article.id;
    });
});

describe('Create Or Remove Bookmarks', () => {
  it('Should return a 404 error if articleId is not found', async () => {
    const response = await request(app)
      .post('/api/v1/articles/10ba038e-48da-487b-96e8-8d3b99b6d58a/bookmark')
      .set('x-auth-token', verifiedToken);
    expect(response.status).to.equal(404);
  });

  it('Should bookmark an article and return a status code of 200', async () => {
    const response = await request(app)
      .post(`/api/v1/articles/${articleId}/bookmark`)
      .set('x-auth-token', verifiedToken);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.all.keys('message', 'bookmark');
  });

  it('Should remove the bookmark on a bookmarked article and return a status code of 200', async () => {
    const response = await request(app)
      .post(`/api/v1/articles/${articleId}/bookmark`)
      .set('x-auth-token', verifiedToken);
    expect(response.status).to.equal(200);
    expect(response.body.message).to.deep.equal('Bookmark removed successfully');
  });

  it('Should allow the user bookmark an article again after removing the bookmark', async () => {
    const response = await request(app)
      .post(`/api/v1/articles/${articleId}/bookmark`)
      .set('x-auth-token', verifiedToken);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.all.keys('message', 'bookmark');
  });
});
