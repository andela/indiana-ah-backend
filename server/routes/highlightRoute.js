import express from 'express';
import HighlightController from '../controllers/highlightController';
import Auth from '../middlewares/jwtAuthentication';

const { authUser } = Auth;
const { articleTextHighlight, editHighlight, deleteHighlight } = HighlightController;
const router = express.Router();
router.post('/:slug/highlights', authUser, articleTextHighlight);
router.patch('/:slug/highlights', authUser, editHighlight);
router.delete('./:slug/highlights', authUser, deleteHighlight);

export default router;
