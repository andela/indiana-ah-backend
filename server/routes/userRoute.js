import express from 'express';
import UserController from '../controllers/userController';
import bookmarkController from '../controllers/bookmarkController';
import signUpValidator from '../middlewares/validators/signUpValidator';
import jwtAuth from '../middlewares/jwtAuthentication';
import parser from '../cloudinaryConfig';
import followAndUnfollow from '../controllers/followController';

const {
  follow,
  fetchFollowing,
  fetchFollowers
} = followAndUnfollow;


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

const { createOrRemoveBookmark } = bookmarkController;

router.post('/register', signUpValidator, registerUser);
router.post('/login', loginUser);
router.post('/users/:articleId/bookmark', jwtAuth.authUser, createOrRemoveBookmark);
router.get('/profiles/:username', jwtAuth.authUser, getUserProfile);
router.get('/profiles', jwtAuth.authUser, getAllUsersProfile);
router.patch('/profiles/:username/update', jwtAuth.authUser, editUserProfile);
router.patch('/users/verify', verifyUser);
router.patch('/profiles/image', jwtAuth.authUser, parser.single('image'), uploadUserPicture);

router.get('/', (req, res) => res.status(200).json({
  message: 'welcome to authors haven platform'
}));
router.post('/users/begin-password-reset', sendPasswordResetLink);
router.patch('/users/reset-password', resetPassword);
router.post('/profiles/:username/follow', jwtAuth.authUser, follow);
router.get('/profiles/users/following', jwtAuth.authUser, fetchFollowing);
router.get('/profiles/users/followers', jwtAuth.authUser, fetchFollowers);
export default router;
