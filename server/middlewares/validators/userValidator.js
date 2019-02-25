import Joi from 'joi';
import isAlphaNumeric from './isAplhaNumeric';
import errorMessage from '../../helpers/errorHelpers';

export default (req, res, next) => {
  const {
    name,
    bio,
    username,
    password
  } = req.body;

  if (password && !isAlphaNumeric(password)) {
    return errorMessage(res, 400, 'Password should be Alphanumeric');
  }

  const schema = {
    name: Joi.string()
      .min(2),
    bio: Joi.string(),
    username: Joi.string()
      .min(3),
    password: Joi.string()
      .alphanum()
      .min(8),
  };

  const { error } = Joi.validate({
    username, password, bio, name
  }, schema);
  if (!error) return next();

  const errorMessageFromJoi = error.details[0].message;

  switch (errorMessageFromJoi) {
    case '"username" must be a string':
      errorMessage(res, 400, 'Username must be a string');
      break;
    case '"username" length must be at least 3 characters long':
      errorMessage(res, 400, 'Username must be at least 3 characters long');
      break;
    case '"name" must be a string':
      errorMessage(res, 400, 'Name must be a string');
      break;
    case '"name" length must be at least 2 characters long':
      errorMessage(res, 400, 'Name must be at least 2 characters long');
      break;
    case '"bio" must be a string':
      errorMessage(res, 400, 'Bio must be a string');
      break;
    case '"password" length must be at least 8 characters long':
      errorMessage(res, 400, 'Password length must be at least 8 characters long');
      break;
    default:
      errorMessage(res, 400, errorMessageFromJoi);
  }
};
