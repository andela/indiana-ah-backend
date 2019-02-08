import request from 'supertest';
import { expect } from 'chai';
import app from '../../index';

let token;
const user = {
  email: 'okukwe@gmail.com'
};
const user1 = {
  email: 'balee@gmail.com',
  password: 'Arukwe'
};
describe('Send reset password link to user', () => {
  it('should return http status code 404 if a user does not exist', () => request(app)
    .post('/api/v1/user/omenkish')
    .set('content-type', 'application/json')
    .send(user)
    .then((res) => {
      expect(res.statusCode).to.equal(404);
      expect(res.body.message).to.equal('This email is not registered in our system');
    }));
  it('should return status code 200 if mail is sent', () => request(app)
    .post('/api/v1/user/omenkish')
    .set('content-type', 'application/json')
    .send(user1)
    .then((res) => {
      // console.log('============>', res.body);
      token = res.body;
      expect(res.statusCode).to.equal(200);
      expect(res.body.message).to.equal(`password reset link sent to ${user1.email}, please check your email`);
    }));
});

describe('Password reset funcionality for users', () => {
  it('should return status code 200 on successful password reset', () => request(app)
    .patch('/api/v1/user/passwordreset')
    .set('x-auth-token', token.token)
    .send(user1)
    .then((res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body.message).to.equal('Password reset successfully');
    }));
  it('should return status code 200 on successful password reset', () => request(app)
    .patch('/api/v1/user/passwordreset')
    .send(user1)
    .then((res) => {
      expect(res.statusCode).to.equal(401);
      expect(res.body.message).to.equal('This link is invalid or expired!!');
    }));
});
