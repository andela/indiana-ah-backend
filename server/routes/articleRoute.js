import { Router } from 'express';
import Auth from '../middlewares/jwtAuthentication';
import validateArticle from '../middlewares/validators/articleValidator';
import ArticleController from '../controllers/articleController';

<<<<<<< HEAD
const {
  createArticle, getAllArticles, updateArticle, getOneArticle
} = ArticleController;
=======
const { createArticle } = ArticleController;
>>>>>>> feat: implement create an article feature

const { authUser } = Auth;

const router = Router();

router.post('/', authUser, validateArticle, createArticle);
<<<<<<< HEAD
router.get('/', getAllArticles);
router.put('/:slug', authUser, updateArticle);
router.get('/:slug', getOneArticle);
=======
>>>>>>> feat: implement create an article feature

export default router;
