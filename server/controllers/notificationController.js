import notificationHelper from '../helpers/notificationHelper';


/**
 * @description Contains method to allow users opt in and out of notification
 * @export
 * @class NotificationControlle
 */
class NotificationController {
  /**
 *
 * @description Method to opt in and out of email Notication
 * @static
 * @param {object} req client request
 * @param {object} res server response
 * @returns {Object} server response object
 * @param  {Function} next passes control to the next middleware
 * @memberof NotificationController
 */
  static async emailNotification(req, res, next) {
    notificationHelper(req, res, next, 'subscribed');
  }

  /**
 *
 * @description Method to opt in and out of push notication
 * @static
 * @param {object} req client request
 * @param {object} res server response
 * @returns {Object} server response object
 * @param  {Function} next passes control to the next middleware
 * @memberof NotificationController
 */
  static async InAppNotification(req, res, next) {
    notificationHelper(req, res, next, 'inAppNotification');
  }
}
export default NotificationController;
