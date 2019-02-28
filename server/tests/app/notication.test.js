import request from 'supertest';
import { expect } from 'chai';
import app from '../../index';
import models from '../../db/models';
import {
  newArticleTemplate,
  newFollowerTemplate,
  newCommentOnBookMarkedArticlesTemplate
} from '../../services/emailTemplates';

import { userkorede, userBuhari } from './mockData/userMockData';

const { Users } = models;

let tokenForkorede;
let tokenForBuhari;

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
});


describe('Email Template', () => {
  it('it should return html email when a user publishes an article', () => {
    expect(newArticleTemplate('dozie', 'www.google.com')).to.be.a('string');
    expect(newArticleTemplate('dozie', 'www.google.com')).to.include('dozie just published a new article.');
  });
  it('it should return html email when a user follows another user', () => {
    expect(newFollowerTemplate('dozie')).to.be.a('string');
    expect(newFollowerTemplate('dozie')).to.include('dozie is now following you on Authors Haven');
  });
  it('it should return html email when a bookmarked article gets new commet', () => {
    expect(newCommentOnBookMarkedArticlesTemplate('dozie')).to.be.a('string');
    expect(newCommentOnBookMarkedArticlesTemplate('dozie')).to.include('dozie just commented on an article you bookmarked ');
  });
});
