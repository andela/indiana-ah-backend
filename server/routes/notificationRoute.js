import express from 'express';
import jwtAuth from '../middlewares/jwtAuthentication';
import NotificationController from '../controllers/notificationController';

const router = express.Router();
const { emailNotification, InAppNotification } = NotificationController;

router.patch('/:notificationStatus/email', jwtAuth.authUser, emailNotification);
router.patch('/:notificationStatus/in-app', jwtAuth.authUser, InAppNotification);

export default router;
