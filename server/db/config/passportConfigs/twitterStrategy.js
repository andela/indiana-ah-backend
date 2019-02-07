import dotenv from 'dotenv';

import UserController from '../../../controllers/userController';

dotenv.config();

const twitterStrategy = require('passport-twitter').Strategy;

const twitter = (passport) => {
  passport.use(
    new twitterStrategy(
      {
        consumerKey: process.env.twitterClientID,
        consumerSecret: process.env.twitterClientSecret,
        callbackURL: 'http://localhost:5000/auth/twitter/callback',
        includeEmail: true,
        proxy: true
      },
      UserController.handleSocialAuth
    )
  );
};

export default twitter;
