import { Router } from 'express';
import userRoute from './userRoute';
import articleRoute from './articleRoute';
import adminRoute from './adminRoute';
import commentReactionRoute from './commentReactionRoute';
import reportRoute from './reportRoute';

const router = Router();

router.use('/articles', articleRoute);
router.use('/articles', reportRoute);
router.use('/', userRoute);
router.use('/admin', adminRoute);
router.use('/comments', commentReactionRoute);

export default router;
