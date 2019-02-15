import models from '../db/models';
import errorMessage from '../helpers/errorHelpers';
import followhelper from '../helpers/followAndUnFollow';

const { Users, Follows } = models;

/**
 * @description Contains all follow and unfollow functionalities
 * @export
 * @class followAndUnfollow
 */

// eslint-disable-next-line require-jsdoc
class FollowController {
  /**
 *
 * @description Method to follow user
 * @static
 * @param {object} req client request
 * @param {object} res erver response
 * @returns {Object} server response object
 * @memberof FollowController
 */

  // eslint-disable-next-line require-jsdoc
  static async followUser(req, res, next) {
    try {
      const heplerResult = await followhelper(req, res, 'followUser');
      const { user, followerId } = heplerResult;
      const { id: authorId, username } = user;
      Follows.findOrCreate({
        where: { authorId, followerId },
        attributes: ['id', 'followerId', 'authorId']
      }).spread((follow, created) => {
        if (created) {
          return res.status(200).json({
            status: '200',
            message: `You are now following ${username}`
          });
        }
        return errorMessage(res, 400, `You are already following ${username}`);
      });
    } catch (error) {
      next(error);
    }
  }

  /**
 *
 * @description Method to unfollow user
 * @static
 * @param {object} req client request
 * @param {object} res erver response
 * @returns {Object} server response object
 * @memberof FollowController
 */

  // eslint-disable-next-line require-jsdoc
  static async unFollowUser(req, res, next) {
    try {
      const heplerResult = await followhelper(req, res, 'unFollowUser');
      const { user, followerId } = heplerResult;
      const authorId = user.id;
      const userToUnfollow = await Follows.findOne({
        where: { authorId, followerId }
      });
      if (!userToUnfollow) return errorMessage(res, 400, `You are not following ${user.username}`);
      const result = await userToUnfollow.destroy();
      const { _changed: { deletedAt } } = result;
      if (deletedAt) {
        return res.status(200).json({
          status: '200',
          message: `You are now unfollowing ${user.username}`
        });
      }
    } catch (error) {
      next(error);
    }
  }


  /**
 *
 * @description Method to fetch all users who I follow
 * @static
 * @param {object} req client request
 * @param {object} res erver response
 * @returns {Object} server response object
 * @memberof followAndUnfollow
 */

  // eslint-disable-next-line require-jsdoc
  static async fetchUsersIFollow(req, res, next) {
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
      next(error);
    }
  }

  /**
 *
 * @description Method to fetch all users who follow me
 * @static
 * @param {object} req client request
 * @param {object} res erver response
 * @returns {Object} server response object
 * @memberof followAndUnfollow
 */

  // eslint-disable-next-line require-jsdoc
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
      next(error);
    }
  }
}
export default FollowController;
