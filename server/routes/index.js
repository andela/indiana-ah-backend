import { Router } from 'express';
import userRoute from './userRoute';
import articleRoute from './articleRoute';
import ratingRoute from './ratingRoute';
import adminRoute from './adminRoute';
import commentReactionRoute from './commentReactionRoute';
import articleHighlight from './highlightRoute';
import reportRoute from './reportRoute';
import Auth from '../middlewares/jwtAuthentication';
import ReportController from '../controllers/reportController';
import verifyAdmin from '../middlewares/verifyAdmin';
import commentRoute from './commentRoute';

const { authUser } = Auth;
const { getAllReports } = ReportController;

const router = Router();

router.use('/articles', articleRoute, ratingRoute, reportRoute);
router.get('/reports', authUser, verifyAdmin, getAllReports);
router.use('/', userRoute);
router.use('/admin', adminRoute);
router.use('/comments', commentReactionRoute);
router.use('/', commentRoute);
router.use('/articles', articleHighlight);

export default router;
