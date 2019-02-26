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
  updateArticlePicture,
  searchArticles
} = ArticleController;

const { createOrRemoveBookmark } = BookmarkController;
const { articleComment, getArticleComments } = CommentController;

const {
  articleReaction,
} = ReactionController;

const { authUser } = Auth;

const router = Router();

router.post('/', authUser, parser.single('image'), validateArticle, createArticle);
router.post('/:articleId/bookmark', authUser, createOrRemoveBookmark);
router.get('/', getAllArticles);
router.get('/user/:username', getAllUserArticles);
router.put('/:slug', authUser, parser.single('image'), updateArticle);
router.get('/search', searchArticles);
router.get('/:slug', getOneArticle);
router.delete('/:slug', authUser, deleteArticle);
router.post('/:slug/reaction', authUser, articleReaction);
router.post('/:slug/comments', authUser, articleComment);
router.patch('/:slug/image', authUser, parser.single('image'), updateArticlePicture);
router.get('/:slug/comments', authUser, getArticleComments);

export default router;
