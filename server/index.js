import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import morgan from 'morgan';
import passport from 'passport';
import session from 'express-session';
import routes from './routes';
import errorMessage from './helpers/errorHelpers';
import auth from './routes/auth';
import google from './db/config/passportConfigs/googleStrategy';
import facebook from './db/config/passportConfigs/facebookStrategy';
import twitter from './db/config/passportConfigs/twitterStrategy';
import logger from './winstonConfig';


google(passport);
facebook(passport);
twitter(passport);

const swaggerDocument = YAML.load('swagger.yaml');

// Create global app object
const app = express();
const PORT = process.env.PORT || 3000;

// Normal express config defaults
app.use(cors());
app.use(morgan('dev'));

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.status(200).json({
  message: 'Welcome to authors haven platform'
}));


app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', auth);
app.use('/api/v1', routes);

// / catch 404 and forward to error handler
app.use('*', (req, res) => res.status(404).json({ error: 'route does not exist' }));

// / catch all unhandled errors
/* eslint-disable-next-line */
app.use((error, req, res, next) => {
  logger.error(error);
  errorMessage(res, 500, 'Internal server error');
});

// finally, let's start our server...
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`server listening on port ${PORT}`);
});

export default app;
