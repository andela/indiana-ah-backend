import express from 'express';
import jwtAuth from '../middlewares/jwtAuthentication';
import NotificationController from '../controllers/notificationController';

const router = express.Router();
const { notification } = NotificationController;

// req.params can only be 'email' or 'inApp''
router.patch('/:emailOrInApp', jwtAuth.authUser, notification);

export default router;
