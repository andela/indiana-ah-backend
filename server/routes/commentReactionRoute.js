import { Router } from 'express';
import CommentReactionController from '../controllers/commentReactionController';
import Auth from '../middlewares/jwtAuthentication';

const { commentReaction } = CommentReactionController;
const { authUser } = Auth;

const router = Router();

router.post('/reaction', authUser, commentReaction);

export default router;
