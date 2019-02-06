import { Router } from 'express';
import userRoute from './userRoute';
import articleRoute from './articleRoute';

const router = Router();

router.use('/articles', articleRoute);
router.use('/', userRoute);

export default router;
