import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import passport from 'passport';
import session from 'express-session';
import routes from './routes';
import errorMessage from './helpers/errorHelpers';
import auth from './routes/auth';
import google from './db/config/passportConfigs/googleStrategy';
import facebook from './db/config/passportConfigs/facebookStrategy';
import twitter from './db/config/passportConfigs/twitterStrategy';

google(passport);
facebook(passport);
twitter(passport);

// Create global app object
const app = express();
const PORT = process.env.PORT || 5000;

// Normal express config defaults
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.status(200).json({
  message: 'welcome to authors haven platform'
}));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// passport.use(google);
app.use('/auth', auth);
app.use('/api/v1', routes);

// / catch 404 and forward to error handler
app.use('*', (req, res) => res.status(404).json({ error: 'route does not exist' }));
app.use((req, res) => errorMessage(res, 500, 'internal server error'));

// finally, let's start our server...
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`server listening on port ${PORT}`);
});

export default app;
