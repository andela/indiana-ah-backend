import { Router } from 'express';
import CommentController from '../controllers/commentController';
import Auth from '../middlewares/jwtAuthentication';


const { deleteComment } = CommentController;
const { authUser } = Auth;

const router = Router();

router.delete('/comments/:id', authUser, deleteComment);

export default router;
