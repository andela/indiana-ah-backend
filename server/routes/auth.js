import express from 'express';
import passport from 'passport';
<<<<<<< HEAD
=======
import UserController from '../controllers/userController';
>>>>>>> 2bdbbe66a8cddad7160b56b4029ac813ef3c37e4

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
<<<<<<< HEAD
  (req, res) => {
    // git console.log('*****reqUser***', req.user);
    // Successful authentication, redirect to home.
    res.redirect('/');
  }
=======
  UserController.socialAuthRedirect
>>>>>>> 2bdbbe66a8cddad7160b56b4029ac813ef3c37e4
);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
    failureRedirect: '/login'
  }),
<<<<<<< HEAD
  (req, res) => {
    // Successful authentication, redirect to home.
    res.redirect('/');
  }
=======
  UserController.socialAuthRedirect
>>>>>>> 2bdbbe66a8cddad7160b56b4029ac813ef3c37e4
);

router.get('/twitter', passport.authenticate('twitter'));

router.get(
  '/twitter/callback',
  passport.authenticate('twitter', { session: false, failureRedirect: '/login' }),
<<<<<<< HEAD
  (req, res) => {
    // Successful authentication, redirect to home.
    res.redirect('/api/v1');
  }
=======
  UserController.socialAuthRedirect
>>>>>>> 2bdbbe66a8cddad7160b56b4029ac813ef3c37e4
);
export default router;
