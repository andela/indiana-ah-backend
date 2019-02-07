import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to home.
    res.redirect('/api/v1');
  }
);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
    failureRedirect: '/login'
  }),
  (req, res) => {
    // Successful authentication, redirect to home.
    res.redirect('/api/v1');
  }
);

router.get('/twitter', passport.authenticate('twitter'));

router.get(
  '/twitter/callback',
  passport.authenticate('twitter', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to home.
    res.redirect('/api/v1');
  }
);
export default router;
