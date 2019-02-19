import models from '../db/models';
import errorMessage from './errorHelpers';

const { Users } = models;

export default async (req, res, action) => {
  const { username } = req.params;

  const user = await Users.findOne({ where: { username } });

  if (!user) return errorMessage(res, 404, 'user does not exist');

  const followOrUnFollow = action === 'followUser' ? 'follow' : 'unfollow';

  if (req.user.id === user.id) return errorMessage(res, 400, `You cannot ${followOrUnFollow} yourself`);

  return { user, followerId: req.user.id };
};
