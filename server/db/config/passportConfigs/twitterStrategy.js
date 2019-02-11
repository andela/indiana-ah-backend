import dotenv from 'dotenv';
import { Strategy as TwitterStrategy } from 'passport-twitter';

import UserController from '../../../controllers/userController';

dotenv.config();

const twitter = (passport) => {
  passport.use(
    new TwitterStrategy(
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
