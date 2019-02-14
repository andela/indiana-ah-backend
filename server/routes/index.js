import { Router } from 'express';
import userRoute from './userRoute';
import articleRoute from './articleRoute';
import adminRoute from './adminRoute';

const router = Router();

router.use('/articles', articleRoute);
router.use('/', userRoute);
router.use('/admin', adminRoute);

export default router;
