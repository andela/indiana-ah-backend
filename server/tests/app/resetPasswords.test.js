import request from 'supertest';
import { expect } from 'chai';
import app from '../../index';
import {
  unregisteredEmail,
  registeredEmail,
  badPassword,
  shortPassword
} from './mockData/profileMockData';

import invalidToken from './mockData/articlesMockData';

let token;

describe('Send reset password link to user', () => {
  it('should return http status code 404 if a user does not exist', () => request(app)
    .post('/api/v1/users/begin-password-reset')
    .set('content-type', 'application/json')
    .send(unregisteredEmail)
    .then((res) => {
      expect(res.statusCode).to.equal(404);
      expect(res.body.message).to.equal('This email is not registered in our system');
    }));
  it('should return status code 200 if mail is sent', () => request(app)
    .post('/api/v1/users/begin-password-reset')
    .set('content-type', 'application/json')
    .send(registeredEmail)
    .then((res) => {
      token = res.body;
      expect(res.statusCode).to.equal(200);
      expect(res.body.message).to.equal(`password reset link sent to ${registeredEmail.email}, please check your email`);
    }));
});

describe('Password reset funcionality for users', () => {
  it('should return status code 200 on successful password reset', () => request(app)
    .patch(`/api/v1/users/reset-password?query=${token.token}`)
    .set('x-auth-token', token.token)
    .send(registeredEmail)
    .then((res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body.message).to.equal('Password reset successfully');
    }));
  it('should return an error if password entered is not alphanumeric', () => request(app)
    .patch(`/api/v1/users/reset-password?query=${token.token}`)
    .set('x-auth-token', token.token)
    .send(badPassword)
    .then((res) => {
      expect(res.statusCode).to.equal(400);
      expect(res.body.message).to.equal('Password should be Alphanumeric');
    }));
  it('should return an error if password entered is not atleast 8 characters long', () => request(app)
    .patch(`/api/v1/users/reset-password?query=${token.token}`)
    .set('x-auth-token', token.token)
    .send(shortPassword)
    .then((res) => {
      expect(res.statusCode).to.equal(400);
      expect(res.body.message).to.equal('Password length must be at least 8 characters long');
    }));
  it('should return status code 401 if link has either expired or is invalid', () => request(app)
    .patch(`/api/v1/users/reset-password?query=${invalidToken}`)
    .send(registeredEmail)
    .then((res) => {
      expect(res.statusCode).to.equal(401);
      expect(res.body.message).to.equal('This link is invalid or expired!!');
    }));
});
