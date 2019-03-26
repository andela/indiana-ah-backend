import request from 'supertest';
import sinonChai from 'sinon-chai';
import chai, { expect } from 'chai';
import app from '../../index';

chai.use(sinonChai);
let realToken;
const fake = 'tryriuorskghabsganvksbhrucfbrajkevsrhntrjdhfngskjbfd';
const efe = {
  email: 'knowled@gmail.com',
  username: 'Efefaith',
  password: '1234efeg'
};

before(() => {
  request(app)
    .post('/api/v1/register')
    .send(efe)
    .then((res) => {
      const { token } = res.body;
      realToken = token;
    });
});

describe('Send verification email', () => {
  it('should send email to an unverified user', () => {
    request(app)
      .post('/api/v1/verify/email')
      .set('x-auth-token', realToken)
      .then((res) => {
        expect(res.status).to.equal(201);
        expect(res.body.message).to.equal('Kindly check your email to verify your account');
      });
  });
  it('should send email to an unverified user', () => {
    request(app)
      .post('/api/v1/verify/email')
      .set('x-auth-token', fake)
      .then((res) => {
        expect(res.status).to.equal(401);
        expect(res.body.message).to.equal('Access denied. You are not authorized to access this route');
      });
  });
});
