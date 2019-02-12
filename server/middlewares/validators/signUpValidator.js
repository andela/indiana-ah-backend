import Joi from 'joi';
import isAlphaNumeric from './isAplhaNumeric';
import errorMessage from '../../helpers/errorHelpers';

export default (req, res, next) => {
  const { username, email, password } = req.body;

  if (password && !isAlphaNumeric(password)) {
    return errorMessage(res, 400, 'Password should be Alphanumeric');
  }

  const schema = {
    username: Joi.string()
      .min(3)
      .required(),
    password: Joi.string()
      .alphanum()
      .min(8)
      .required(),
    email: Joi.string()
      .email({ minDomainAtoms: 2 })
      .required()
  };

  const { error } = Joi.validate({ username, password, email }, schema);
  if (!error) return next();

  const errorMessageFromJoi = error.details[0].message;

  switch (errorMessageFromJoi) {
    case '"username" is not allowed to be empty':
      errorMessage(res, 400, 'No username was specified');
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
    case '"email" is not allowed to be empty':
      errorMessage(res, 400, 'No email was specified');
      break;
    case '"email" must be a valid email':
      errorMessage(res, 400, 'Email is not valid');
      break;
    default:
      errorMessage(res, 400, errorMessageFromJoi);
  }
};
