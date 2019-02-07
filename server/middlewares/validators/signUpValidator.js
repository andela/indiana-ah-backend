import Joi from 'joi';
import isAlphaNumeric from './isAplhaNumeric';
import errorMessage from '../../helpers/errorHelpers';


export default (req, res, next) => {
  const { username, email, password } = req.body;

  if (!isAlphaNumeric(password)) {
    return errorMessage(res, 400, 'Password Should be Alphanumeric');
  }

  const schema = {
    username: Joi.string().min(3).required(),
    password: Joi.string().alphanum().min(8),
    email: Joi.string().email({ minDomainAtoms: 2 })
  };

  const { error } = Joi.validate({ username, password, email, }, schema);

  if (!error) return next();

  switch (error.details[0].message) {
    case '"username" is not allowed to be empty':
      errorMessage(res, 400, 'No Username was specified');
      break;
    case '"username" must be a string':
      errorMessage(res, 400, 'Username must be a string');
      break;
    case '"username" length must be at least 3 characters long':
      errorMessage(res, 400, 'Username must be at least 3 characters long');
      break;
    case '"password" is not allowed to be empty':
      errorMessage(res, 400, 'No password was specified');
      break;
    case '"password" length must be at least 8 characters long':
      errorMessage(res, 400, 'Password length must be at least 8 characters long');
      break;
    case '"password" must be a string':
      errorMessage(res, 400, 'Password must be alphanumeric');
      break;
    case '"email" is not allowed to be empty':
      errorMessage(res, 400, 'No Email was specified');
      break;
    case '"email" must be a valid email':
      errorMessage(res, 400, 'Email is not valid');
      break;
    default:
      errorMessage(res, 400, error.details[0].message);
  }
};
