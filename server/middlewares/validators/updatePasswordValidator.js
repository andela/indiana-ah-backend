import Joi from 'joi';
import isAlphaNumeric from './isAplhaNumeric';
import errorMessage from '../../helpers/errorHelpers';

export default (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  const schema = {
    currentPassword: Joi.string()
      .alphanum()
      .min(8)
      .required(),
    newPassword: Joi.string()
      .alphanum()
      .min(8)
      .required(),
    confirmPassword: Joi.string()
      .alphanum()
      .min(8)
      .required()
  };

  const { error } = Joi.validate({ currentPassword, newPassword, confirmPassword }, schema);
  if (!error) {
    if (
      !isAlphaNumeric(currentPassword)
      || !isAlphaNumeric(newPassword)
      || !isAlphaNumeric(confirmPassword)
    ) {
      return errorMessage(res, 400, 'Passwords should be Alphanumeric');
    }
    if (newPassword === confirmPassword) {
      return next();
    }
    return errorMessage(res, 400, 'Passwords must be the same');
  }

  const errorMessageFromJoi = error.details[0].message;

  switch (errorMessageFromJoi) {
    case '"currentPassword" is required':
      errorMessage(res, 400, 'Enter your current password');
      break;
    case '"newPassword" is required':
      errorMessage(res, 400, 'Enter your new password');
      break;
    case '"currentPassword" length must be at least 8 characters long':
      errorMessage(res, 400, 'Password length must be at least 8 characters long');
      break;
    case '"newPassword" length must be at least 8 characters long':
      errorMessage(res, 400, 'New password length must be at least 8 characters long');
      break;
    case '"confirmPassword" is required':
      errorMessage(res, 400, 'Confirm your new password');
      break;

    default:
      errorMessage(res, 400, errorMessageFromJoi);
  }
};
