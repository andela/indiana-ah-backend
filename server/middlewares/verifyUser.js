import errorMessage from '../helpers/errorHelpers';


const validateUser = (req, res, next) => {
  const user = req.params.username;
  const loggedUser = req.user.username;
  if (user !== loggedUser) {
    return errorMessage(res, 401, 'You are not authorized to access this route');
  }
  return next();
};
export default validateUser;
