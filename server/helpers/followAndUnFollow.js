import models from '../db/models';
import errorMessage from './errorHelpers';

const { Users } = models;

export default async (req, res) => {
  const { username } = req.params;

  const user = await Users.findOne({ where: { username } });

  if (!user) return errorMessage(res, 404, 'user does not exist');

  if (req.user.id === user.id) return errorMessage(res, 400, 'You cannot follow yourself');

  return { user, followerId: req.user.id };
};
