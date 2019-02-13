import { Router } from 'express';
import Auth from '../middlewares/jwtAuthentication';
import { validateArticle, validateRating } from '../middlewares/validators/articleValidators';
import ArticleController from '../controllers/articleController';
import CommentController from '../controllers/commentController';
import RatingController from '../controllers/ratingController';

const {
  createArticle,
  getAllArticles,
  updateArticle,
  getOneArticle,
  getAllUserArticles,
  deleteArticle
} = ArticleController;

const { articleComment } = CommentController;
const { rateArticle, getOneArticleRating, getAllArticleRatings } = RatingController;

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

router.post('/:slug/comments', authUser, articleComment);


export default router;
