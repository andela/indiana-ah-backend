import Joi from 'joi';
import isAlphaNumeric from './isAplhaNumeric';
import errorMessage from '../../helpers/errorHelpers';

export default (req, res, next) => {
  const { password } = req.body;

  if (password && !isAlphaNumeric(password)) {
    return errorMessage(res, 400, 'Password should be Alphanumeric');
  }

  const schema = {
    password: Joi.string()
      .alphanum()
      .min(8),
  };

  const { error } = Joi.validate({ password }, schema);
  if (!error) return next();

  const errorMessageFromJoi = error.details[0].message;

  if (errorMessageFromJoi === '"password" length must be at least 8 characters long') {
    errorMessage(res, 400, 'Password length must be at least 8 characters long');
  }
  errorMessage(res, 400, errorMessageFromJoi);
};
