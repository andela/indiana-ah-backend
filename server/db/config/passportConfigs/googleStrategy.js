import dotenv from 'dotenv';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import UserController from '../../../controllers/userController';

dotenv.config();

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
};

export default google;
