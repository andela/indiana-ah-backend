import { Router } from 'express';
import Auth from '../middlewares/jwtAuthentication';
import validateArticle from '../middlewares/validators/articleValidator';
import ArticleController from '../controllers/articleController';

const { createArticle } = ArticleController;

const { authUser } = Auth;

const router = Router();

router.post('/', authUser, validateArticle, createArticle);

export default router;
