import { Router } from 'express';
import Auth from '../middlewares/jwtAuthentication';
import { validateArticle } from '../middlewares/validators/articleValidators';
import ArticleController from '../controllers/articleController';
import CommentController from '../controllers/commentController';
import ReactionController from '../controllers/reactionController';

const {
  createArticle,
  getAllArticles,
  updateArticle,
  getOneArticle,
  getAllUserArticles,
  deleteArticle
} = ArticleController;

const { articleComment } = CommentController;

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
router.post('/:slug/comments', authUser, articleComment);

export default router;
