import request from 'supertest';
import { expect } from 'chai';
import app from '../../index';
import models from '../../db/models';
import {
  userBiola, userBalogun, userAkeem, userDivine, userKelvin
}
  from './mockData/userMockData';
import { user1 } from './mockData/articlesMockData';

const { Users } = models;

let tokenForBalogun;
let tokenForBiola;
let tokenForDivine;
let tokenForKevin;

before(async () => {
  await Users.create(userBalogun);
  return request(app)
    .post('/api/v1/login')
    .send({ email: userBalogun.email, password: userBalogun.password })
    .then((res) => {
      tokenForBalogun = res.body.token;
    });
});

before(async () => {
  await Users.create(userBiola);
  return request(app)
    .post('/api/v1/login')
    .send({ email: userBiola.email, password: userBiola.password })
    .then((res) => {
      tokenForBiola = res.body.token;
    });
});

before(async () => {
  await Users.create(userDivine);
  return request(app)
    .post('/api/v1/login')
    .send({ email: userDivine.email, password: userDivine.password })
    .then((res) => {
      tokenForDivine = res.body.token;
    });
});

before(async () => {
  await Users.create(userKelvin);
  return request(app)
    .post('/api/v1/login')
    .send({ email: userKelvin.email, password: userKelvin.password })
    .then((res) => {
      tokenForKevin = res.body.token;
    });
});

before(async () => {
  await Users.create(userAkeem);
  return request(app)
    .post('/api/v1/login')
    .send({ email: userAkeem.email, password: userAkeem.password });
});

describe('Follow  and Unfollow Feature', () => {
  it('should not allow a user to follow him/her self ', () => request(app)
    .post('/api/v1/profiles/biola/follow')
    .set('x-auth-token', tokenForBalogun)
    .then((res) => {
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('You cannot follow yourself');
    }));

  it('should not allow a user to follow an unexisting user', () => request(app)
    .post('/api/v1/profiles/kemi/follow')
    .set('x-auth-token', tokenForBalogun)
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('user does not exist');
    }));

  it('should allow a user to follow an existing user', () => request(app)
    .post(`/api/v1/profiles/${userAkeem.username}/follow`)
    .set('x-auth-token', tokenForBalogun)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal(`You are now following ${userAkeem.username}`);
    }));


  it('should allow a user to follow an existing user', () => request(app)
    .post(`/api/v1/profiles/${user1.username}/follow`)
    .set('x-auth-token', tokenForDivine)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal(`You are now following ${user1.username}`);
    }));

  it('should allow a user to follow an existing user', () => request(app)
    .post(`/api/v1/profiles/${user1.username}/follow`)
    .set('x-auth-token', tokenForKevin)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal(`You are now following ${user1.username}`);
    }));

  it('should allow a user to unfollow a currently follwed user', () => request(app)
    .post(`/api/v1/profiles/${userAkeem.username}/follow`)
    .set('x-auth-token', tokenForBalogun)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal(`You have unfollowed ${userAkeem.username}`);
    }));

  it('should notify users without followers that they do not have followers', () => request(app)
    .get('/api/v1/profiles/users/followers')
    .set('x-auth-token', tokenForBalogun)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('You currently do not have any followers');
    }));

  it('should allow a user to follow an existing user', () => request(app)
    .post(`/api/v1/profiles/${userBiola.username}/follow`)
    .set('x-auth-token', tokenForBalogun)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal(`You are now following ${userBiola.username}`);
    }));

  it('should return a list of all users I follow', () => request(app)
    .get('/api/v1/profiles/users/followers')
    .set('x-auth-token', tokenForBiola)
    .then((res) => {
      expect(res.body.following).to.be.an('array');
    }));
});
