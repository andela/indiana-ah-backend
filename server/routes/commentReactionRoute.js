import { Router } from 'express';
import CommentReactionController from '../controllers/commentReactionController';
import Auth from '../middlewares/jwtAuthentication';

const { commentReaction, getAllCommentReactions } = CommentReactionController;
const { authUser } = Auth;

const router = Router();

router.post('/reaction', authUser, commentReaction);
router.get('/reaction', getAllCommentReactions);

export default router;
