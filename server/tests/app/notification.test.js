import request from 'supertest';
import { expect } from 'chai';
import app from '../../index';
import models from '../../db/models';
import {
  newArticleTemplate,
  newFollowerTemplate,
  newCommentOnBookMarkedArticlesTemplate
} from '../../services/emailTemplates';

import {
  userkorede,
  userBuhari,
  userBashorun,
  userAntalaniyan
} from './mockData/userMockData';

import { validArticle } from './mockData/articlesMockData';

const { Users } = models;

let tokenForkorede;
let tokenForBuhari;
let tokenForBashorun;
let tokenForAntalaniyan;
let articleId;
let articleSlug;

before(async () => {
  await Users.create(userkorede);
  return request(app)
    .post('/api/v1/login')
    .send({ email: userkorede.email, password: userkorede.password })
    .then((res) => {
      tokenForkorede = res.body.token;
    });
});

before(async () => {
  await Users.create(userBuhari);
  return request(app)
    .post('/api/v1/login')
    .send({ email: userBuhari.email, password: userBuhari.password })
    .then((res) => {
      tokenForBuhari = res.body.token;
    });
});

before(async () => {
  await Users.create(userBashorun);
  return request(app)
    .post('/api/v1/login')
    .send({ email: userBashorun.email, password: userBashorun.password })
    .then((res) => {
      tokenForBashorun = res.body.token;
    });
});

before(async () => {
  await Users.create(userAntalaniyan);
  return request(app)
    .post('/api/v1/login')
    .send({ email: userAntalaniyan.email, password: userAntalaniyan.password })
    .then((res) => {
      tokenForAntalaniyan = res.body.token;
    });
});

before(async () => {
  await request(app)
    .post('/api/v1/articles')
    .set('x-auth-token', tokenForBashorun)
    .send(validArticle)
    .then((res) => {
      articleId = res.body.article.id;
      articleSlug = res.body.article.slug;
    });
});

before(async () => {
  await request(app)
    .post(`/api/v1/articles/${articleId}/bookmark`)
    .set('x-auth-token', tokenForBashorun);
});

before(async () => {
  await request(app)
    .post(`/api/v1/articles/${articleId}/bookmark`)
    .set('x-auth-token', tokenForAntalaniyan);
});


describe('Subscription to  notification', () => {
  it('should a user to subscribe for email notification', () => request(app)
    .patch('/api/v1/notifications/email')
    .set('x-auth-token', tokenForkorede)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('You have successfully subscribed to our email notifications');
    }));

  it('should allow a user to opt-out of email notification', () => request(app)
    .patch('/api/v1/notifications/email')
    .set('x-auth-token', tokenForkorede)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('You will no longer receive email notifications from us');
    }));

  it('should a user to subscribe for In-app notification', () => request(app)
    .patch('/api/v1/notifications/inApp')
    .set('x-auth-token', tokenForBuhari)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('You have successfully subscribed to in app notifications');
    }));

  it('should allow a user to opt-out of app notification', () => request(app)
    .patch('/api/v1/notifications/inApp')
    .set('x-auth-token', tokenForBuhari)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('You will no longer receive in-app notifications from us');
    }));

  it('Should allow a verified user comment on an article', () => request(app)
    .post(`/api/v1/articles/${articleSlug}/comments`)
    .set('x-auth-token', tokenForBashorun)
    .send({ commentBody: 'This is making sense part 2', articleId })
    .then((res) => {
      expect(res.status).to.equal(201);
      expect(res.body.message).to.equal('Comment posted successfully');
    }));
});


describe('Email Template', () => {
  it('it should return html email when a user publishes an article', () => {
    expect(newArticleTemplate('dozie', 'www.google.com')).to.be.a('string');
    expect(newArticleTemplate('dozie', 'www.google.com')).to.include('dozie just published a new article.');
  });
  it('it should return html email when a user follows another user', () => {
    expect(newFollowerTemplate('dozie', 'www.google.com')).to.be.a('string');
    expect(newFollowerTemplate('dozie', 'www.google.com')).to.include('dozie is now following you on Authors Haven');
  });
  it('it should return html email when a bookmarked article gets new comment', () => {
    expect(newCommentOnBookMarkedArticlesTemplate('dozie', 'www.google.com')).to.be.a('string');
    expect(newCommentOnBookMarkedArticlesTemplate('dozie', 'www.google.com')).to.include('dozie just commented on an article you bookmarked');
  });
});
