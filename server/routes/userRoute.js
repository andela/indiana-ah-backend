import express from 'express';
import UserController from '../controllers/userController';

const router = express.Router();
const { registerUser } = UserController;

router.get('/', (req, res) => res.status(200).json({
  message: 'welcome to authors haven platform'
}));

router.post('/register', registerUser);

export default router;
