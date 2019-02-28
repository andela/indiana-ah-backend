import models from '../db/models';

const { Users } = models;

export default async (req, res, next, userColumn) => {
  const { id } = req.user;

  try {
    const user = await Users.findOne({ where: { id }, attributes: ['id', 'email', userColumn] });

    // This toggle the bolean value
    const newNotificationStatus = !user.dataValues[userColumn];

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
        const message = inAppNotification === true ? 'You have successfully subscribed to in app notifications' : 'You will no longer receive in-app notifications from us';
        return res.status(200).json({ message, statusCode: 200 });
      }
    }
  } catch (error) {
    return next(error);
  }
};
