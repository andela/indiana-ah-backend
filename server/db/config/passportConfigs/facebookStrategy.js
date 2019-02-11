import dotenv from 'dotenv';
import { Strategy as FacebookStrategy } from 'passport-facebook';

import UserController from '../../../controllers/userController';

dotenv.config();

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
