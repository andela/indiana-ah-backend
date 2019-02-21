import { Router } from 'express';
import userRoute from './userRoute';
import articleRoute from './articleRoute';
import adminRoute from './adminRoute';
import commentReactionRoute from './commentReactionRoute';
import readingStats from './readingStatRoute';

const router = Router();

router.use('/articles', articleRoute);
router.use('/', userRoute);
router.use('/admin', adminRoute);
router.use('/comments', commentReactionRoute);
router.use('/statistics', readingStats);

export default router;
