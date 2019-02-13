import dotenv from 'dotenv';
import { Strategy as TwitterStrategy } from 'passport-twitter';

import UserController from '../../../controllers/userController';

dotenv.config();

const twitter = (passport) => {
  passport.use(new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CLIENT_ID,
      consumerSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/twitter/callback',
      includeEmail: true,
      proxy: true
    },
    UserController.handleSocialAuth
  ));
};

export default twitter;
