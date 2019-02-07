import request from 'supertest';
import { expect } from 'chai';
import app from '../../index';

const user = {
  email: 'okukwe@gmail.com'
};
const user1 = {
  email: 'balee@gmail.com'
};
describe('Password reset funcionality for users', () => {
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
      expect(res.statusCode).to.equal(200);
      expect(res.body.message).to.equal(`password reset link sent to ${user1.email}, please check your email`);
    }));
});
