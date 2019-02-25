import errorMessage from '../helpers/errorHelpers';


const validateUser = (req, res, next) => {
  const user = req.params.username;
  const loggedUser = req.user.username;
  if (user !== loggedUser) {
    return errorMessage(res, 403, 'User not authorized');
  }
  return next();
};
export default validateUser;
