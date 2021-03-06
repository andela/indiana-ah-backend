import express from 'express';
import UserController from '../controllers/userController';
import ReadingStatisticsController from '../controllers/ReadingStatisticsController';
import signUpValidator from '../middlewares/validators/signUpValidator';
import resetPasswordValidator from '../middlewares/validators/resetPasswordValidator';
import updatePasswordValidator from '../middlewares/validators/updatePasswordValidator';
import userValidator from '../middlewares/validators/userValidator';
import jwtAuth from '../middlewares/jwtAuthentication';
import parser from '../cloudinaryConfig';
import followAndUnfollow from '../controllers/followController';
import BookmarkController from '../controllers/bookmarkController';
import validateUser from '../middlewares/verifyUser';

const { follow, fetchFollowing, fetchFollowers } = followAndUnfollow;
const { getReadingStatistics } = ReadingStatisticsController;

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
  resetPassword,
  deleteUserProfile,
  updatePassword,
  removeUserPicture,
  sendVerifyEmail
} = UserController;

const { getUserBookmarkedArticles } = BookmarkController;

router.post('/register', signUpValidator, registerUser);
router.patch('/users/verify', verifyUser);
router.post('/login', loginUser);
router.get('/profiles/:username', jwtAuth.authUser, getUserProfile);
router.get('/profiles', jwtAuth.authUser, getAllUsersProfile);
router.patch(
  '/profiles/:username/update',
  jwtAuth.authUser,
  validateUser,
  userValidator,
  editUserProfile
);
router.patch(
  '/profiles/:username/image',
  jwtAuth.authUser,
  validateUser,
  parser.single('image'),
  uploadUserPicture
);
router.patch('/profiles/:username/remove-image', jwtAuth.authUser, validateUser, removeUserPicture);
router.put('/profiles/:username', jwtAuth.authUser, validateUser, deleteUserProfile);
router.post('/users/begin-password-reset', sendPasswordResetLink);
router.patch('/users/reset-password', resetPasswordValidator, resetPassword);
router.patch(
  '/profiles/:username/password',
  jwtAuth.authUser,
  validateUser,
  updatePasswordValidator,
  updatePassword
);
router.post('/profiles/:username/follow', jwtAuth.authUser, follow);
router.get('/profiles/users/following', jwtAuth.authUser, fetchFollowing);
router.get('/profiles/users/followers', jwtAuth.authUser, fetchFollowers);
router.get('/users/bookmarks', jwtAuth.authUser, getUserBookmarkedArticles);
router.get('/users/statistics', jwtAuth.authUser, getReadingStatistics);
router.post('/verify/email', jwtAuth.authUserEmail, sendVerifyEmail);

export default router;
