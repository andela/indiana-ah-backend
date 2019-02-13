import express from 'express';
import RoleController from '../controllers/RoleAssignController';
import Auth from '../middlewares/jwtAuthentication';
import verifyAdmin from '../middlewares/verifyAdmin';

const router = express.Router();

const { assignRole } = RoleController;
const { authUser } = Auth;

<<<<<<< HEAD
router.post('/assign', authUser, verifyAdmin, assignRole);
=======
router.post('/', authUser, verifyAdmin, assignRole);
>>>>>>> 19f0e5f8d748f750f9e75bf63418aa7936a84a8b

export default router;
