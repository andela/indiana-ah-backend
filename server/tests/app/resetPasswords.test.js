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
    .post('/api/v1/users/begin-password-reset')
    .set('content-type', 'application/json')
    .send(user)
    .then((res) => {
      expect(res.statusCode).to.equal(404);
      expect(res.body.message).to.equal('This email is not registered in our system');
    }));
  it('should return status code 200 if mail is sent', () => request(app)
    .post('/api/v1/users/begin-password-reset')
    .set('content-type', 'application/json')
    .send(user1)
    .then((res) => {
      token = res.body;
      expect(res.statusCode).to.equal(200);
      expect(res.body.message).to.equal(`password reset link sent to ${user1.email}, please check your email`);
    }));
});

describe('Password reset funcionality for users', () => {
  const invalidToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJpZCI6ImM3MjNmNmMzLTM3MjktNDk1YS04NTAzLWQzNDE2YWY4NjdjMyIsInVzZXJuYW1lIjoib21lbmtpc2gxI
    iwiZW1haWwiOiJvbWVua2lzaDFAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJ
    pYXQiOjE1NTA1Nzk1MzUsImV4cCI6MTU1MDY2NTkzNX0.xGV14r8s5TxeW93Jrjy-iD6BT2j-VCmtsyaq-AT775p`;
  it('should return status code 200 on successful password reset', () => request(app)
    .patch(`/api/v1/users/reset-password?query=${token.token}`)
    .set('x-auth-token', token.token)
    .send(user1)
    .then((res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body.message).to.equal('Password reset successfully');
    }));
  it('should return status code 401 if link has either expired or is invalid', () => request(app)
    .patch(`/api/v1/users/reset-password?query=${invalidToken}`)
    .send(user1)
    .then((res) => {
      expect(res.statusCode).to.equal(401);
      expect(res.body.message).to.equal('This link is invalid or expired!!');
    }));
});
