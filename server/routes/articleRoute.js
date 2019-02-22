import { Router } from 'express';
import Auth from '../middlewares/jwtAuthentication';
import { validateArticle } from '../middlewares/validators/articleValidators';
import ArticleController from '../controllers/articleController';
import CommentController from '../controllers/commentController';
import BookmarkController from '../controllers/bookmarkController';
import ReactionController from '../controllers/reactionController';

const {
  createArticle,
  getAllArticles,
  updateArticle,
  getOneArticle,
  getAllUserArticles,
  deleteArticle,
  searchArticles
} = ArticleController;

const { createOrRemoveBookmark } = BookmarkController;
const { articleComment, getArticleComments } = CommentController;

const {
  rateArticle, getOneArticleRating, getAllArticleRatings, cancelRating
} = RatingsController;
const { articleComment, getAllArticleComments, updateComment } = CommentController;

const { authUser } = Auth;

const router = Router();

router.post('/', authUser, validateArticle, createArticle);
router.post('/:articleId/bookmark', authUser, createOrRemoveBookmark);
router.get('/', getAllArticles);
router.get('/user/:username', getAllUserArticles);
router.get('/search', searchArticles);
router.get('/:slug', getOneArticle);
router.get('/', getAllArticles);
router.put('/:slug/update', authUser, updateArticle);
router.delete('/:slug/delete', authUser, deleteArticle);
router.post('/:slug/reaction', authUser, articleReaction);
router.post('/:slug/comments', authUser, articleComment);
router.get('/:slug/comments', getAllArticleComments);
router.put('/comments/:commentId', authUser, updateComment);

export default router;
