import { Router } from 'express';
import Auth from '../middlewares/jwtAuthentication';
import validateArticle from '../middlewares/validators/articleValidator';
import ArticleController from '../controllers/articleController';

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
const {
  createArticle, getAllArticles, updateArticle, getOneArticle
} = ArticleController;
=======
const { createArticle } = ArticleController;
>>>>>>> feat: implement create an article feature
=======
const { createArticle, getAllArticles } = ArticleController;
>>>>>>> feat: implement get all articles feature
=======
const { createArticle, getAllArticles, updateArticle } = ArticleController;
>>>>>>> feat implement update an article feature
=======
const {
  createArticle, getAllArticles, updateArticle, getOneArticle
} = ArticleController;
>>>>>>> feat: implement get a single article feature

const { authUser } = Auth;

const router = Router();

router.post('/', authUser, validateArticle, createArticle);
<<<<<<< HEAD
<<<<<<< HEAD
router.get('/', getAllArticles);
<<<<<<< HEAD
router.put('/:slug', authUser, updateArticle);
router.get('/:slug', getOneArticle);
=======
>>>>>>> feat: implement create an article feature
=======
router.get('/', getAllArticles);
>>>>>>> feat: implement get all articles feature
=======
router.put('/:slug', authUser, validateArticle, updateArticle);
<<<<<<< HEAD
>>>>>>> feat implement update an article feature
=======
router.get('/:slug', getOneArticle);
>>>>>>> feat: implement get a single article feature

export default router;
