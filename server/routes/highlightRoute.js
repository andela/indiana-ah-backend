import express from 'express';
import HighlightController from '../controllers/highlightController';
import Auth from '../middlewares/jwtAuthentication';

const { authUser } = Auth;
const {
  articleTextHighlight, editHighlight, deleteHighlight, getHighlight
} = HighlightController;
const router = express.Router();
router.post('/:slug/highlights', authUser, articleTextHighlight);
router.patch('/:slug/highlights/:id', authUser, editHighlight);
router.delete('/:slug/highlights/:id', authUser, deleteHighlight);
router.get('/:slug/highlights', authUser, getHighlight);

export default router;
