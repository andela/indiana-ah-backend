import models from '../db/models';
import sendEmail from './email';
import errorMessage from '../helpers/errorHelpers';
import { newArticleTemplate, newCommentOnBookMarkedArticlesTemplate } from './emailTemplates';
import pusher from './pusherConfig';

const { Users, Follows, Bookmarks } = models;

/**
 * @description Contains all email and in app notification services
 * @export
 * @class NotificationServices
 */
class NotificationServices {
  /**
 *
 * @description  Method to notify a user's followers via email/push when an article is published
 * @static
 * @param {object} req client request
 * @param {object} res server response
 * @param {string} slug article slug
 * @returns {Object} server response object
 * @memberof NotificationServices
 */
  static async notifyViaEmailAndPush(req, res, slug) {
    try {
      const myFollowers = await Follows.findAll({
        where: { authorId: req.user.id },
        attributes: [],
        include: [
          {
            model: Users,
            attributes: [
              'id',
              'username',
              'email',
              'subscribed',
              'inAppNotification'
            ],
            as: 'followerDetails'
          }
        ]
      });

      if (myFollowers.length === 0) return;

      const myFollowersWithEmailSub = myFollowers.map(item => (
        {
          id: item.followerDetails.id,
          username: item.followerDetails.username,
          email: item.followerDetails.email,
          subscribed: item.followerDetails.subscribed
        }
      )).filter(eachUser => eachUser.subscribed === true);

      const myFollowersWithInAppSub = myFollowers.map(item => (
        {
          inAppNotification: item.followerDetails.inAppNotification,
          id: item.followerDetails.id,
        }
      )).filter(eachUser => eachUser.inAppNotification === true);

      const message = `${req.user.username} just published an article`;
      const location = req.get('host');
      const url = `${location}/api/v1/articles/${slug}`;

      if (myFollowersWithEmailSub.length !== 0) {
        const myFollowersEmail = myFollowersWithEmailSub.map(each => each.email);
        const emailTemplate = newArticleTemplate(req.user.username, url);
        sendEmail(myFollowersEmail, `${message}`, emailTemplate);
      }

      if (myFollowersWithInAppSub.length !== 0) {
        myFollowersWithInAppSub.forEach(user => pusher.trigger('notification', user.id, { message }));
      }
    } catch (error) {
      return errorMessage(res, 400, `${error}`);
    }
  }

  /**
 *
 * @description Notify users via email/push when a bookmarked article has new comment
 * @static
 * @param {object} req client request
 *  @param {object} res server response
 * @param {string} articleId client request
 * @returns {Object} server response object
 * @memberof NotificationServices
 */
  static async notifyUsersWhoBookmarked(req, res, articleId) {
    try {
      // returns an array of userID who have bookmarked the article commented on
      const arrayOfUserIDs = await Bookmarks.findAll({ where: { articleId } })
        .map(bookmarkColumn => bookmarkColumn.dataValues.userId);

      // An array of users who have subcribed to Email notification
      const arrayOfAllUsersEmailWithEmailSub = await Users.findAll({ where: { subscribed: true }, attributes: ['id', 'email', 'subscribed'] })
        .map(eachUserObject => (
          {
            id: eachUserObject.dataValues.id,
            email: eachUserObject.dataValues.email,
          }
        ));

      // An array of users who have boomarked the article AND also subcribed to Email notification
      const usersWhoBookmarkedWithEmailSub = arrayOfAllUsersEmailWithEmailSub
        .filter((_eachUser, index) => arrayOfUserIDs
          .includes(arrayOfAllUsersEmailWithEmailSub[index].id));

      // notify via email
      if (usersWhoBookmarkedWithEmailSub.length !== 0) {
        const emailAddresses = usersWhoBookmarkedWithEmailSub.map(each => each.email);
        const emailTemplate = newCommentOnBookMarkedArticlesTemplate(req.user.username);
        sendEmail(emailAddresses, 'Hi there', emailTemplate);
      }

      // An array of usersID currently subcribed to In-App notification
      const arrayOfUserIDsWithInAppNot = await Users.findAll({ where: { inAppNotification: true }, attributes: ['id', 'inAppNotification'] })
        .map(userCol => userCol.dataValues.id);

      // An array of usersID who have boomarked the article and are subcribed to In-app notification
      const usersWhoBookmarkedAndHaveInAppNot = arrayOfUserIDs
        .filter(eachId => arrayOfUserIDsWithInAppNot.indexOf(eachId) !== -1);

      // notify via In app
      if (usersWhoBookmarkedAndHaveInAppNot.length !== 0) {
        usersWhoBookmarkedAndHaveInAppNot.forEach(userID => pusher.trigger('notification', userID, { message: `${req.user.username} just commented on an article you bookmarked` }));
      }
    } catch (error) {
      return errorMessage(res, 400, `${error}`);
    }
  }
}
export default NotificationServices;
