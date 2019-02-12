import { Router } from 'express';
import Auth from '../middlewares/jwtAuthentication';
import validateArticle from '../middlewares/validators/articleValidator';
import ArticleController from '../controllers/articleController';
import ReactionController from '../controllers/reactionController';

const {
  createArticle,
  getAllArticles,
  updateArticle,
  getOneArticle,
  getAllUserArticles,
  deleteArticle
} = ArticleController;

const {
  articleReaction,
} = ReactionController;

const { authUser } = Auth;

const router = Router();

router.post('/', authUser, validateArticle, createArticle);
router.get('/', getAllArticles);
router.get('/user/:username', getAllUserArticles);
router.put('/:slug/update', authUser, updateArticle);
router.get('/:slug', getOneArticle);
router.delete('/:slug/delete', authUser, deleteArticle);
router.post('/:slug/reaction', authUser, articleReaction);

export default router;
