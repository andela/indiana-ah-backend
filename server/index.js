import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import routes from './routes';

// Create global app object
const app = express();
const PORT = process.env.PORT || 3000;

// Normal express config defaults
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.status(200).json({
  message: 'welcome to authors haven platform'
}));

app.use('/api/v1', routes);

// / catch 404 and forward to error handler
app.use('*', (req, res) => res.status(404).json({ error: 'route does not exist' }));

// finally, let's start our server...
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`server listening on port ${PORT}`);
});

export default app;
