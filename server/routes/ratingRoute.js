import { Router } from 'express';
import RatingsController from '../controllers/ratingsController';
import Auth from '../middlewares/jwtAuthentication';
import { validateRating } from '../middlewares/validators/articleValidators';

const router = Router();

const {
  rateArticle, getOneArticleRating, getAllArticleRatings, cancelRating
} = RatingsController;

const { authUser } = Auth;

router.post('/:articleId/ratings', authUser, validateRating, rateArticle);
router.get('/ratings/:ratingId', getOneArticleRating);
router.get('/:articleId/ratings', getAllArticleRatings);
router.delete('/ratings/:ratingId/cancel', authUser, cancelRating);

export default router;
