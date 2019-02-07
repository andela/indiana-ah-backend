import dotenv from 'dotenv';

import UserController from '../../../controllers/userController';

dotenv.config();

const FacebookStrategy = require('passport-facebook').Strategy;

const facebook = (passport) => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.facebookClientID,
        clientSecret: process.env.facebookClientSecret,
        callbackURL: 'http://localhost:5000/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'photos', 'emails'],
        proxy: true
      },
      UserController.handleSocialAuth
    )
  );
};

export default facebook;
