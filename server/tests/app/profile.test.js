import request from 'supertest';
import { expect } from 'chai';
import app from '../../index';
import assignToken from '../../helpers/assignJwtToken';
import {
  data, payload, badPayload, user1, badBio, badName,
  badUsername, invalidUsername, invalidName,
  incorrectPasswordData, badPasswordData1, badPasswordData2, badPasswordData3,
  badPasswordData4, badPasswordData5, badPasswordData6, badPasswordData7,
  correctPasswordData
} from './mockData/profileMockData';

const falseToken = assignToken(payload);
const badToken = assignToken(badPayload);

let firstToken = '';
let secondToken = '';

before(async () => {
  const res = await request(app)
    .post('/api/v1/register')
    .send(user1);
  firstToken = res.body.token;
});

describe('User verification', () => {
  it('should verify a user\'s account', () => request(app)
    .patch(`/api/v1/users/verify?query=${firstToken}`)
    .then((res) => {
      secondToken = res.body.token;
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('User Successfully Verified');
    }));
});

describe('User profile', () => {
  it('should return an error if an invalid username is provided', () => request(app)
    .get('/api/v1/profiles/tiku')
    .set('x-auth-token', secondToken)
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('User not found');
    }));

  it('should return the user\'s profile when a valid username is provided', () => request(app)
    .get('/api/v1/profiles/cim')
    .set('x-auth-token', secondToken)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.profile).to.be.an('object');
    }));
});

describe('Get all users profile', () => {
  it('should return the profiles of all users', () => request(app)
    .get('/api/v1/profiles?page=1')
    .set('x-auth-token', secondToken)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.profiles).to.be.an('array');
    }));
});

describe('Edit user profile', () => {
  it('should return an error if user is not authenticated', () => request(app)
    .patch('/api/v1/profiles/cim/update')
    .send(data)
    .then((res) => {
      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal('Access denied. You are not authorized to access this route');
    }));
  it('should return an error when invalid ID passed', () => request(app)
    .patch('/api/v1/profiles/tiku/update')
    .set('x-auth-token', falseToken)
    .send(data)
    .then((res) => {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('User not found');
    }));
  it('should return an error when a user who is not the owner of the profile tries to visit the route', () => request(app)
    .patch('/api/v1/profiles/king/update')
    .set('x-auth-token', secondToken)
    .send(data)
    .then((res) => {
      expect(res.status).to.equal(403);
      expect(res.body.message).to.equal('User not authorized');
    }));
  it('should return an error when short username is passed', () => request(app)
    .patch('/api/v1/profiles/cim/update')
    .set('x-auth-token', secondToken)
    .send(badUsername)
    .then((res) => {
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Username must be at least 3 characters long');
    }));
  it('should return an error when invalid username is passed', () => request(app)
    .patch('/api/v1/profiles/cim/update')
    .set('x-auth-token', secondToken)
    .send(invalidUsername)
    .then((res) => {
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Username must be a string');
    }));
  it('should return an error when short name is passed', () => request(app)
    .patch('/api/v1/profiles/cim/update')
    .set('x-auth-token', secondToken)
    .send(badName)
    .then((res) => {
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Name must be at least 2 characters long');
    }));
  it('should return an error when invalid name is passed', () => request(app)
    .patch('/api/v1/profiles/cim/update')
    .set('x-auth-token', secondToken)
    .send(invalidName)
    .then((res) => {
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Name must be a string');
    }));
  it('should return an error when invalid bio is passed', () => request(app)
    .patch('/api/v1/profiles/cim/update')
    .set('x-auth-token', secondToken)
    .send(badBio)
    .then((res) => {
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Bio must be a string');
    }));
  it('should return updated user profile if user is authenticated and verified', () => request(app)
    .patch('/api/v1/profiles/cim/update')
    .set('x-auth-token', secondToken)
    .send(data)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.profile).to.be.an('object');
    }));
});

describe('Update user password', () => {
  it('should return an error when the user is not authorized', () => request(app)
    .patch('/api/v1/profiles/king/password')
    .set('x-auth-token', secondToken)
    .send(incorrectPasswordData)
    .then((res) => {
      expect(res.status).to.equal(403);
      expect(res.body.message).to.equal('User not authorized');
    }));
  it('should return an error when an incorrect old password is passed', () => request(app)
    .patch('/api/v1/profiles/cim/password')
    .set('x-auth-token', secondToken)
    .send(incorrectPasswordData)
    .then((res) => {
      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal('Error updating password');
    }));
  it('should return an error when an invalid new password is passed', () => request(app)
    .patch('/api/v1/profiles/cim/password')
    .set('x-auth-token', secondToken)
    .send(badPasswordData1)
    .then((res) => {
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Passwords should be Alphanumeric');
    }));
  it('should return an error when passwords do not match', () => request(app)
    .patch('/api/v1/profiles/cim/password')
    .set('x-auth-token', secondToken)
    .send(badPasswordData2)
    .then((res) => {
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Passwords must be the same');
    }));

  it('should return an error when password is not long enough', () => request(app)
    .patch('/api/v1/profiles/cim/password')
    .set('x-auth-token', secondToken)
    .send(badPasswordData3)
    .then((res) => {
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('New password length must be at least 8 characters long');
    }));

  it('should return an error when password is not long enough', () => request(app)
    .patch('/api/v1/profiles/cim/password')
    .set('x-auth-token', secondToken)
    .send(badPasswordData4)
    .then((res) => {
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Password length must be at least 8 characters long');
    }));

  it('should return an error when new password is not entered', () => request(app)
    .patch('/api/v1/profiles/cim/password')
    .set('x-auth-token', secondToken)
    .send(badPasswordData5)
    .then((res) => {
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Enter your new password');
    }));

  it('should return an error when current password is not entered', () => request(app)
    .patch('/api/v1/profiles/cim/password')
    .set('x-auth-token', secondToken)
    .send(badPasswordData6)
    .then((res) => {
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Enter your current password');
    }));

  it('should return an error when the user has not confirmed new password', () => request(app)
    .patch('/api/v1/profiles/cim/password')
    .set('x-auth-token', secondToken)
    .send(badPasswordData7)
    .then((res) => {
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Confirm your new password');
    }));
  it('should update a user\'s password if correct information is passed and user is authenticated', () => request(app)
    .patch('/api/v1/profiles/cim/password')
    .set('x-auth-token', secondToken)
    .send(correctPasswordData)
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Password successfully updated');
    }));
});

describe('Edit user picture', () => {
  it('should return an error if user is not authenticated', () => request(app)
    .patch('/api/v1/profiles/cim/image')
    .type('form')
    .attach('image', 'server/tests/testImage/feather.jpg')
    .then((res) => {
      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal('Access denied. You are not authorized to access this route');
    }));
  it('should return updated user picture if user is authenticated and verified', () => request(app)
    .patch('/api/v1/profiles/cim/image')
    .set('x-auth-token', secondToken)
    .type('form')
    .attach('image', 'server/tests/testImage/feather.jpg')
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.picture).to.match(/^http/);
    }));
  it('should return an error when an invalid ID type is passed', () => request(app)
    .patch('/api/v1/profiles/cim/image')
    .set('x-auth-token', badToken)
    .type('form')
    .attach('image', 'server/tests/testImage/feather.jpg')
    .then((res) => {
      expect(res.status).to.equal(500);
      expect(res.body.message).to.equal('Internal server error');
    }));
});
