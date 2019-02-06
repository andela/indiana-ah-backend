import { Router } from 'express';
import Auth from '../middlewares/jwtAuthentication';
import validateArticle from '../middlewares/validators/articleValidator';
import ArticleController from '../controllers/articleController';

const {
  createArticle, getAllArticles, updateArticle, getOneArticle
} = ArticleController;

const { authUser } = Auth;

const router = Router();

router.post('/', authUser, validateArticle, createArticle);
router.get('/', getAllArticles);
router.put('/:slug', authUser, validateArticle, updateArticle);
router.get('/:slug', getOneArticle);

export default router;
