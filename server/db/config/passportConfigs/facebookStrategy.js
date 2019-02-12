import dotenv from 'dotenv';

import UserController from '../../../controllers/userController';

dotenv.config();

const FacebookStrategy = require('passport-facebook').Strategy;

const facebook = (passport) => {
<<<<<<< HEAD
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
=======
  passport.use(new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'photos', 'emails'],
      proxy: true
    },
    UserController.handleSocialAuth
  ));
>>>>>>> 2bdbbe66a8cddad7160b56b4029ac813ef3c37e4
};

export default facebook;
