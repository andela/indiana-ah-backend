import express from 'express';
import UserController from '../controllers/userController';
import signUpValidator from '../middlewares/validators/signUpValidator';

const router = express.Router();
const { registerUser, loginUser } = UserController;

router.post('/register', signUpValidator, registerUser);
router.post('/login', loginUser);

export default router;
