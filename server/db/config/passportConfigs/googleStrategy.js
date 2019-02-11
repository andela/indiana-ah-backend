import dotenv from 'dotenv';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import UserController from '../../../controllers/userController';

dotenv.config();

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

// const mockStrategy = new MockStrategy('google', UserController.handleSocialAuth);

// const availableStrategy = process.env.NODE_ENV === 'test' ? mockStrategy : google;

// export default availableStrategy;
export default google;
