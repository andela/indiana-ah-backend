import models from '../db/models';
import sendEmail from './email';
import errorMessage from '../helpers/errorHelpers';
import { newArticleTemplate } from './emailTemplates';
import pusher from './pusherConfig';

const { Users, Follows } = models;


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
 * @returns {Object} server response object
 * @memberof NotificationServices
 */
  static async notifyViaEmailAndPush(req, res) {
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

      if (myFollowersWithEmailSub.length !== 0) {
        const myFollowersEmail = myFollowersWithEmailSub.map(each => each.email);
        const emailTemplate = newArticleTemplate(req.user.username);
        sendEmail(myFollowersEmail, `${message}`, emailTemplate);
      }

      if (myFollowersWithInAppSub.length !== 0) {
        myFollowersWithInAppSub.forEach(user => pusher.trigger('notification', user.id, { message }));
      }
    } catch (error) {
      return errorMessage(res, 400, `${error}`);
    }
  }
}
export default NotificationServices;
