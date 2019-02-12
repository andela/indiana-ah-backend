import dotenv from 'dotenv';
<<<<<<< HEAD
=======
import { Strategy as TwitterStrategy } from 'passport-twitter';
>>>>>>> 2bdbbe66a8cddad7160b56b4029ac813ef3c37e4

import UserController from '../../../controllers/userController';

dotenv.config();

<<<<<<< HEAD
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
=======
const twitter = (passport) => {
  passport.use(new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CLIENT_ID,
      consumerSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/twitter/callback',
      includeEmail: true,
      proxy: true
    },
    UserController.handleSocialAuth
  ));
>>>>>>> 2bdbbe66a8cddad7160b56b4029ac813ef3c37e4
};

export default twitter;
