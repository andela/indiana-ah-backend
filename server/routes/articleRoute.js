import { Router } from 'express';
import Auth from '../middlewares/jwtAuthentication';
import { validateArticle } from '../middlewares/validators/articleValidators';
import ArticleController from '../controllers/articleController';
import CommentController from '../controllers/commentController';
import ReactionController from '../controllers/reactionController';
import parser from '../cloudinaryConfig';

const {
  createArticle,
  getAllArticles,
  updateArticle,
  getOneArticle,
  getAllUserArticles,
  deleteArticle,
  updateArticlePicture
} = ArticleController;

const { articleComment } = CommentController;

const {
  articleReaction,
} = ReactionController;

const { authUser } = Auth;

const router = Router();

router.post('/', authUser, parser.single('image'), validateArticle, createArticle);
router.get('/', getAllArticles);
router.get('/user/:username', getAllUserArticles);
router.put('/:slug/update', authUser, parser.single('image'), updateArticle);
router.get('/:slug', getOneArticle);
router.delete('/:slug/delete', authUser, deleteArticle);
router.post('/:slug/reaction', authUser, articleReaction);
router.post('/:slug/comments', authUser, articleComment);
router.patch('/:slug/image', authUser, parser.single('image'), updateArticlePicture);

export default router;
