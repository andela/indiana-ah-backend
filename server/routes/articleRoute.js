import { Router } from 'express';
import Auth from '../middlewares/jwtAuthentication';
import validateArticle from '../middlewares/validators/articleValidator';
import ArticleController from '../controllers/articleController';

const {
  createArticle,
  getAllArticles,
  updateArticle,
  getOneArticle,
  deleteArticle
} = ArticleController;

const { authUser } = Auth;

const router = Router();

router.post('/', authUser, validateArticle, createArticle);
router.get('/', getAllArticles);
router.put('/:slug', authUser, updateArticle);
router.get('/:slug', getOneArticle);
router.delete('/:slug', deleteArticle);

export default router;
