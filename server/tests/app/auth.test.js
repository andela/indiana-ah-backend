import request from 'supertest';
import { expect } from 'chai';
import app from '../../index';

const user2 = {
  username: 'balee',
  password: 'baleesecret23'
};

const user3 = {
  username: '',
  email: 'biola@gmail.com',
  password: 'baleesecret23'
};

const user4 = {
  username: 9999,
  email: 'b@gmail.com',
  password: 'baleesecret23'
};

const user5 = {
  username: 'ab',
  email: 'b@gmail.com',
  password: 'baleesecret23'
};

const user6 = {
  username: 'abiola balogun',
  email: 'b@gmail.com'
};

const user6b = {
  username: 'abiola balogun',
  email: 'b@gmail.com',
  password: ''
};

const user7 = {
  username: 'abiola balogun',
  email: 'b@gmail.com',
  password: 'efe3'
};

const user8 = {
  username: 'abiola balogun',
  email: 'b@gmail.com',
  password: 9999999999
};

const user9 = {
  username: 'abiola balogun',
  email: '',
  password: '9999999999a'
};

const user10 = {
  username: 'abiola balogun',
  email: 'f@g',
  password: '9999999999a'
};

const user11 = {
  email: 'balee@gmail.com',
  password: 'baleesecret23'
};

describe('all unregistered routes', () => {
  it('should give an error when the route entered is an unregistered one', () => {
    request(app)
      .get('/*')
      .then((res) => {
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('route does not exist');
        expect(res.status).to.equal(404);
      });
  });
});

describe('user registration', () => {
  it('should fail on registration, since the  email field was not provided', () => request(app)
    .post('/api/v1/register')
    .set('content-type', 'application/json')
    .send(user2)
    .then((res) => {
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('"email" is required');
    }));

  it('should register new user', () => request(app)
    .post('/api/v1/register')
    .set('content-type', 'application/json')
    .send({
      username: 'baleeqwqw',
      email: 'balee@gmail.com',
      password: 'baleesecret23'
    })

    .then((res) => {
      expect(res.status).to.equal(201);
      expect(res.body.message).to.equal('Successfully registered to Authors haven. Kindly check your email to verify your account');
    }));

  it('should fail if user email exists', () => request(app)
    .post('/api/v1/register')
    .set('content-type', 'application/json')
    .send({
      username: 'baleeqwqwt',
      email: 'balee@gmail.com',
      password: 'baleesecret23'
    })

    .then((res) => {
      expect(res.status).to.equal(409);
      expect(res.body.message).to.equal('this email already exists');
    }));

  it('should fail if username exists', () => request(app)
    .post('/api/v1/register')
    .set('content-type', 'application/json')
    .send({
      username: 'baleeqwqw',
      email: 'baleeq@gmail.com',
      password: 'baleesecret23'
    })

    .then((res) => {
      expect(res.status).to.equal(409);
      expect(res.body.message).to.equal('this username already exists');
    }));

  it('should login a user', () => request(app)
    .post('/api/v1/login')
    .set('content-type', 'application/json')
    .send(user11)

    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('successfully logged in');
    }));
});

describe('Sign Up Validation', () => {
  it('should fail on registration, since the username field was  empty', () => request(app)
    .post('/api/v1/register')
    .set('content-type', 'application/json')
    .send(user3)
    .then((res) => {
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('No username was specified');
    }));

  it('should fail on registration, since the username is a string', () => request(app)
    .post('/api/v1/register')
    .set('content-type', 'application/json')
    .send(user4)
    .then((res) => {
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Username must be a string');
    }));

  it('should fail on registration, since the username is less than 3 characters', () => request(app)
    .post('/api/v1/register')
    .set('content-type', 'application/json')
    .send(user5)
    .then((res) => {
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Username must be at least 3 characters long');
    }));

  it('should fail on registration, since the password field was not provided', () => request(app)
    .post('/api/v1/register')
    .set('content-type', 'application/json')
    .send(user6)
    .then((res) => {
      expect(res.body.message).to.equal('"password" is required');
      expect(res.statusCode).to.equal(400);
    }));

  it('should fail on registration, since the password field is empty', () => request(app)
    .post('/api/v1/register')
    .set('content-type', 'application/json')
    .send(user6b)
    .then((res) => {
      expect(res.body.message).to.equal('No password was specified');
      expect(res.statusCode).to.equal(400);
    }));

  it('should fail on registration, since the password is less than 8 characters', () => request(app)
    .post('/api/v1/register')
    .set('content-type', 'application/json')
    .send(user7)
    .then((res) => {
      expect(res.body.message).to.equal('Password length must be at least 8 characters long');
      expect(res.statusCode).to.equal(400);
    }));

  it('should fail on registration, since the password is  not aplhanumeric', () => request(app)
    .post('/api/v1/register')
    .set('content-type', 'application/json')
    .send(user8)
    .then((res) => {
      expect(res.body.message).to.equal('Password should be Alphanumeric');
      expect(res.statusCode).to.equal(400);
    }));

  it('should fail on registration, since the email is  not provided', () => request(app)
    .post('/api/v1/register')
    .set('content-type', 'application/json')
    .send(user9)
    .then((res) => {
      expect(res.body.message).to.equal('No email was specified');
      expect(res.statusCode).to.equal(400);
    }));

  it('should fail on registration, since the email is  not valid', () => request(app)
    .post('/api/v1/register')
    .set('content-type', 'application/json')
    .send(user10)
    .then((res) => {
      expect(res.body.message).to.equal('Email is not valid');
      expect(res.statusCode).to.equal(400);
    }));
});
