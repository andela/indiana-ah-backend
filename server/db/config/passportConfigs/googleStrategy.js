import dotenv from 'dotenv';

import UserController from '../../../controllers/userController';

dotenv.config();

const GoogleStrategy = require('passport-google-oauth20').Strategy;

const google = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.googleClientID,
        clientSecret: process.env.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
      },
      UserController.handleSocialAuth
    )
  );
};

export default google;
