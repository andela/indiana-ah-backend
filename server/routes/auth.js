import express from 'express';
import passport from 'passport';
import UserController from '../controllers/userController';

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  UserController.socialAuthRedirect
);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
    failureRedirect: '/login'
  }),
  UserController.socialAuthRedirect
);

router.get('/twitter', passport.authenticate('twitter'));

router.get(
  '/twitter/callback',
  passport.authenticate('twitter', { session: false, failureRedirect: '/login' }),
  UserController.socialAuthRedirect
);
export default router;
