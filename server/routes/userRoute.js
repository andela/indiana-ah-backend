import express from 'express';
import UserController from '../controllers/userController';
import signUpValidator from '../middlewares/validators/signUpValidator';
import jwtAuth from '../middlewares/jwtAuthentication';
import parser from '../cloudinaryConfig';

const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsersProfile,
  editUserProfile,
  uploadUserPicture,
  verifyUser,
  sendPasswordResetLink,
  resetPassword
} = UserController;

router.post('/register', signUpValidator, registerUser);
router.post('/login', loginUser);
router.get('/profiles/:username', jwtAuth.authUser, getUserProfile);
router.get('/profiles', getAllUsersProfile);
router.patch('/profiles/:username/update', jwtAuth.authUser, editUserProfile);
router.patch('/users/verify', verifyUser);
router.patch('/profiles/image', jwtAuth.authUser, parser.single('image'), uploadUserPicture);

router.post('/users/begin_reset_password', sendPasswordResetLink);
router.patch('/users/resetpassword', resetPassword);

export default router;
