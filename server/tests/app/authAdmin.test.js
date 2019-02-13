/* eslint-disable no-unused-vars */
import request from 'supertest';
import dotenv from 'dotenv';
import { expect } from 'chai';
import app from '../../index';

dotenv.config();

let regularUserToken, superAdminToken;

describe('the admin role', () => {
  before(async () => {
    const {
      header: { 'x-auth-token': token }
    } = await request(app)
      .post('/api/v1/login')
      .set('content-type', 'application/json')
      .send({
        email: 'ezenwa9000@gmail.com',
        password: 'baleesecret48'
      });
    regularUserToken = token;
    const {
      header: { 'x-auth-token': token2 }
    } = await request(app)
      .post('/api/v1/login')
      .set('content-type', 'application/json')
      .send({
        email: process.env.SUPER_ADMIN_EMAIL,
        password: process.env.SUPER_ADMIN_PASSWORD
      });
    superAdminToken = token2;
  });
  describe('access the superAdmin route', () => {
    it('should fail if a regular user tries to update another user role', () => {
      request(app)
        .post('/api/v1/admin/assign')
        .set('content-type', 'application/json')
        .set('x-auth-token', regularUserToken)
        .send({
          username: 'balee@gmail.com',
          role: 'admin'
        })
        .then((res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('you are not authorized to perform this action, admin only');
        });
    });
    it('should succeed if the superAdmin tries to update a user role', () => {
      request(app)
        .post('/api/v1/admin/assign')
        .set('content-type', 'application/json')
        .set('x-auth-token', superAdminToken)
        .send({
          username: 'cim',
          role: 'admin'
        })
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('successfully updated user role');
          expect(res.body.updatedUser).to.be.an('Object');
        });
    });
    it('should fail if the user does not exist', () => {
      request(app)
        .post('/api/v1/admin/assign')
        .set('content-type', 'application/json')
        .set('x-auth-token', superAdminToken)
        .send({
          username: 'cima',
          role: 'admin'
        })
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('this user was not found');
        });
    });
  });
});
