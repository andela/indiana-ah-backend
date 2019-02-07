import express from 'express';
import UserController from '../controllers/userController';
import signUpValidator from '../middlewares/validators/signUpValidator';

const router = express.Router();
const { registerUser } = UserController;

router.post('/register', signUpValidator, registerUser);

export default router;
