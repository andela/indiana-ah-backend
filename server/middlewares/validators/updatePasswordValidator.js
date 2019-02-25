import Joi from 'joi';
import isAlphaNumeric from './isAplhaNumeric';
import errorMessage from '../../helpers/errorHelpers';

export default (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const schema = {
    currentPassword: Joi.string()
      .alphanum()
      .min(8)
      .required(),
    newPassword: Joi.string()
      .alphanum()
      .min(8)
      .required()
  };

  const { error } = Joi.validate({ currentPassword, newPassword }, schema);
  if (!error) {
    if (!isAlphaNumeric(currentPassword) || !isAlphaNumeric(newPassword)) {
      return errorMessage(res, 400, 'Password should be Alphanumeric');
    }
    return next();
  }

  const errorMessageFromJoi = error.details[0].message;

  if (errorMessageFromJoi === '"password" length must be at least 8 characters long') {
    errorMessage(res, 400, 'Password length must be at least 8 characters long');
  }
  errorMessage(res, 400, errorMessageFromJoi);
};
