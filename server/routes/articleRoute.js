import { Router } from 'express';
import Auth from '../middlewares/jwtAuthentication';
import { validateArticle } from '../middlewares/validators/articleValidators';
import ArticleController from '../controllers/articleController';
import CommentController from '../controllers/commentController';
import BookmarkController from '../controllers/bookmarkController';
import ReactionController from '../controllers/reactionController';
import parser from '../cloudinaryConfig';

const {
  createArticle,
  getAllArticles,
  updateArticle,
  getOneArticle,
  getAllUserArticles,
  deleteArticle,
  searchArticles,
  updateArticlePicture,
  removeArticlePicture
} = ArticleController;

const { createOrRemoveBookmark } = BookmarkController;

const { articleReaction } = ReactionController;

const {
  createComment,
  getAllArticleComments,
  updateComment,
  getCommentEditHistory
} = CommentController;

const { authUser } = Auth;

const router = Router();

router.post('/', authUser, parser.single('image'), validateArticle, createArticle);
router.post('/:articleId/bookmark', authUser, createOrRemoveBookmark);
router.get('/', getAllArticles);
router.get('/comments/:commentId/history', authUser, getCommentEditHistory);
router.get('/user/:username', getAllUserArticles);
router.put('/:slug/update', authUser, parser.single('image'), updateArticle);
router.patch('/:slug/image', authUser, parser.single('image'), updateArticlePicture);
router.patch('/:slug/remove-image', authUser, removeArticlePicture);
router.get('/search', searchArticles);
router.get('/:slug/comments', getAllArticleComments);
router.get('/:slug', getOneArticle);
router.delete('/:slug', authUser, deleteArticle);
router.post('/:slug/reaction', authUser, articleReaction);
router.patch('/:slug/image', authUser, parser.single('image'), updateArticlePicture);
router.get('/:slug/comments', getAllArticleComments);
router.post('/:slug/comments', authUser, createComment);
router.put('/comments/:commentId', authUser, updateComment);

export default router;
