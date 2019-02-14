import express from 'express';
import RoleController from '../controllers/RoleAssignController';
import Auth from '../middlewares/jwtAuthentication';
import verifyAdmin from '../middlewares/verifyAdmin';

const router = express.Router();

const { assignRole } = RoleController;
const { authUser } = Auth;

router.post('/role', authUser, verifyAdmin, assignRole);

export default router;
