import { Router } from 'express';
import Auth from '../middlewares/jwtAuthentication';
import { validateArticle, validateRating } from '../middlewares/validators/articleValidators';
import ArticleController from '../controllers/articleController';
import CommentController from '../controllers/commentController';
import RatingsController from '../controllers/ratingsController';
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
  rateArticle, getOneArticleRating, getAllArticleRatings, cancelRating
} = RatingsController;
const {
  articleReaction,
} = ReactionController;

const { authUser } = Auth;

const router = Router();

router.post('/', authUser, validateArticle, createArticle);
router.post('/:articleId/ratings', authUser, validateRating, rateArticle);
router.get('/', getAllArticles);
router.get('/ratings/:ratingId', getOneArticleRating);
router.get('/:articleId/ratings', getAllArticleRatings);
router.get('/user/:username', getAllUserArticles);
router.put('/:slug/update', authUser, updateArticle);
router.get('/:slug', getOneArticle);
router.delete('/:slug/delete', authUser, deleteArticle);
router.delete('/ratings/:ratingId/cancel', authUser, cancelRating);
router.post('/:slug/comments', authUser, articleComment);
router.post('/:slug/reaction', authUser, articleReaction);

export default router;
