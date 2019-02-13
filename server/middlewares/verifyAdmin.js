import errorMessage from '../helpers/errorHelpers';

const validateAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role !== 'superAdmin') {
    return errorMessage(res, 401, 'you are not authorized to perform this action, admin only');
  }
  return next();
};
export default validateAdmin;
