import errorMessage from '../helpers/errorHelpers';
import models from '../db/models';

const { Users } = models;

const validateUser = async (req, res, next) => {
  const { username } = req.params;
  const requestingUserId = req.user.id;
  const requestedUser = await Users.findOne({
    where: { username },
    attributes: [
      'id',
    ]
  });
  if (requestedUser) {
    const { id } = requestedUser;
    if (id !== requestingUserId) {
      return errorMessage(res, 403, 'User not authorized');
    }
    return next();
  }
  return errorMessage(res, 403, 'User not found');
};
export default validateUser;
