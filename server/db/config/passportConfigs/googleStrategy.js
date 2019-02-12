import dotenv from 'dotenv';
<<<<<<< HEAD
=======
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
>>>>>>> 2bdbbe66a8cddad7160b56b4029ac813ef3c37e4

import UserController from '../../../controllers/userController';

dotenv.config();

<<<<<<< HEAD
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
=======
const google = (passport) => {
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    UserController.handleSocialAuth
  ));
>>>>>>> 2bdbbe66a8cddad7160b56b4029ac813ef3c37e4
};

export default google;
