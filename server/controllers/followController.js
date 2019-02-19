import models from '../db/models';
import followhelper from '../helpers/followAndUnFollow';

const { Users, Follows } = models;

/**
 * @description Contains all follow and unfollow functionalities
 * @export
 * @class FollowController
 */
class FollowController {
  /**
 *
 * @description Method to follow and unfollow user
 * @static
 * @param {object} req client request
 * @param {object} res server response
 * @returns {Object} server response object
 * @param  {Function} next passes control to the next middleware
 * @memberof FollowController
 */
  static async follow(req, res, next) {
    try {
      const helperResult = await followhelper(req, res);
      const { user, followerId } = helperResult;
      const { id: authorId, username } = user;
      await Follows.findOrCreate({
        where: { authorId, followerId },
        attributes: ['id', 'followerId', 'authorId']
      }).spread(async (follow, created) => {
        if (created) return res.status(200).json({ status: '200', message: `You are now following ${username}` });

        const result = await follow.destroy();
        const { _changed: { deletedAt } } = result;
        if (deletedAt) {
          return res.status(200).json({
            status: '200',
            message: `You have unfollowed ${username}`
          });
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
 *
 * @description Method to fetch all users who I follow
 * @static
 * @param {object} req client request
 * @param {object} res server response
 * @returns {Object} server response object
 * @param  {Function} next passes control to the next middleware
 * @memberof FollowController
 */
  static async fetchFollowing(req, res, next) {
    try {
      const usersIfollow = await Follows.findAll({
        where: { followerId: req.user.id },
        attributes: [],
        include: [
          {
            model: Users,
            attributes: [
              'username',
              'bio',
              'imageUrl'
            ],
            as: 'authorDetails'
          }
        ]
      });
      if (usersIfollow.length === 0) {
        return res.status(200).json({ status: 200, message: 'You currently do not follow anyone' });
      }
      const response = usersIfollow.map(item => (
        {
          username: item.authorDetails.username,
          bio: item.authorDetails.bio,
          imageUrl: item.authorDetails.imageUrl
        }
      ));
      return res.status(200).json({ following: response, count: response.length });
    } catch (error) {
      return next(error);
    }
  }

  /**
 *
 * @description Method to fetch all users who follow me
 * @static
 * @param {object} req client request
 * @param {object} res server response
 * @returns {Object} server response object
 * @param {Function} next passes control to the next middleware
 * @memberof FollowController
 */
  static async fetchFollowers(req, res, next) {
    try {
      const myFollowers = await Follows.findAll({
        where: { authorId: req.user.id },
        attributes: [],
        include: [
          {
            model: Users,
            attributes: [
              'username',
              'bio',
              'imageUrl'
            ],
            as: 'followerDetails'
          }
        ]
      });
      if (myFollowers.length === 0) {
        return res.status(200).json({ status: 200, message: 'You currently do not have any followers' });
      }
      const response = myFollowers.map(item => (
        {
          username: item.followerDetails.username,
          bio: item.followerDetails.bio,
          imageUrl: item.followerDetails.imageUrl
        }
      ));
      return res.status(200).json({ following: response, count: response.length });
    } catch (error) {
      return next(error);
    }
  }
}
export default FollowController;
