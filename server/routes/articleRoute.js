import { Router } from 'express';
import Auth from '../middlewares/jwtAuthentication';
import { validateArticle, validateRating } from '../middlewares/validators/articleValidators';
import ArticleController from '../controllers/articleController';
import CommentController from '../controllers/commentController';
import RatingsController from '../controllers/ratingsController';

const {
  createArticle,
  getAllArticles,
  updateArticle,
  getOneArticle,
  getAllUserArticles,
  deleteArticle,
  searchArticles
} = ArticleController;
const {
  rateArticle, getOneArticleRating, getAllArticleRatings, cancelRating
} = RatingsController;
const { articleComment, getArticleComment } = CommentController;

const { authUser } = Auth;

const router = Router();

router.post('/', authUser, validateArticle, createArticle);
router.post('/:articleId/ratings', authUser, validateRating, rateArticle);
router.get('/ratings/:ratingId', getOneArticleRating);
router.get('/:articleId/ratings', getAllArticleRatings);
router.get('/user/:username', getAllUserArticles);
router.get('/search', searchArticles);
router.get('/:slug', getOneArticle);
router.get('/', getAllArticles);
router.put('/:slug/update', authUser, updateArticle);
router.delete('/:slug/delete', authUser, deleteArticle);
router.delete('/ratings/:ratingId/cancel', authUser, cancelRating);
router.post('/:slug/comments', authUser, articleComment);
router.get('/:slug/comments', authUser, getArticleComment);

export default router;
