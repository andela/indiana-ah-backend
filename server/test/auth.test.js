import request from 'supertest';
import { expect } from 'chai';
import app from '../index';

const user1 = {
  username: 'balee',
  email: 'balee@gmail.com',
  password: 'baleesecret'
};

const user2 = {
  username: 'balee',
  password: 'baleesecret'
};

describe('all unregistered routes', () => {
  it('should give an error when the route entered is an unregistered one', () => {
    request(app)
      .get('/*')
      .then((res) => {
        expect(res.body.error.message).to.equal('Not Found');
        expect(res.status).to.equal(404);
      });
  });
});

describe('user registration', () => {
  it('should fail on registration, since the email field was not provided', () => request(app)
    .post('/api/v1/register')
    .set('content-type', 'application/json')
    .send(user2)
    .then((res) => {
      expect(res.status).to.equal(500);
      expect(res.body.message).to.equal('error in registration');
    }));

  it('should register new user', () => request(app)
    .post('/api/v1/register')
    .set('content-type', 'application/json')
    .send(user1)

    .then((res) => {
      expect(res.status).to.equal(201);
      expect(res.body.message).to.equal('successfully registered to authors haven');
    }));

  it('should fail if user exists', () => request(app)
    .post('/api/v1/register')
    .set('content-type', 'application/json')
    .send(user1)

    .then((res) => {
      expect(res.status).to.equal(409);
      expect(res.body.message).to.equal('this email or username already exists');
    }));
});
