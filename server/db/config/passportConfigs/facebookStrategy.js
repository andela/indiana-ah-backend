import dotenv from 'dotenv';

import UserController from '../../../controllers/userController';

dotenv.config();

const FacebookStrategy = require('passport-facebook').Strategy;

const facebook = (passport) => {
  passport.use(new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/facebook/callback`,
      profileFields: ['id', 'displayName', 'photos', 'emails'],
      proxy: true
    },
    UserController.handleSocialAuth
  ));
};

export default facebook;
