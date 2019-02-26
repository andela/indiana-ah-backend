import models from '../db/models';
import errorMessage from './errorHelpers';

const { Users } = models;

export default async (req, res, next, userColumn) => {
  const { id } = req.user;
  const { notificationStatus } = req.params;
  const acceptedParams = ['TRUE', 'FALSE'];

  if (!acceptedParams.includes(notificationStatus)) return errorMessage(res, 400, 'Error in getting notified/unnotified');

  // Shortned Tenary Operator assigning boolean to newNotificationStatus
  const newNotificationStatus = notificationStatus === 'TRUE';

  try {
    const updatedUser = await Users.update(
      {
        [userColumn]: newNotificationStatus,
      },
      {
        where: { id },
        returning: true
      }
    );

    if (userColumn === 'subscribed') {
      const { subscribed } = updatedUser[1][0].dataValues;
      if (subscribed === newNotificationStatus) {
        const message = subscribed === true ? 'You have successfully subscribed to our email notifications' : 'You will no longer receive email notifications from us';
        return res.status(200).json({ message, statusCode: 200 });
      }
    }
    if (userColumn === 'inAppNotification') {
      const { inAppNotification } = updatedUser[1][0].dataValues;
      if (inAppNotification === newNotificationStatus) {
        const message = inAppNotification === true ? 'You have successfully subscribed to in app our notifications' : 'You will no longer receive in-app notifications from us';
        return res.status(200).json({ message, statusCode: 200 });
      }
    }
  } catch (error) {
    return next(error);
  }
};
