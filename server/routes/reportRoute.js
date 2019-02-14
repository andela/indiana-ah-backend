import express from 'express';
import ReportController from '../controllers/reportController';
import Auth from '../middlewares/jwtAuthentication';
import verifyAdmin from '../middlewares/verifyAdmin';

const { authUser } = Auth;
const { reportArticle, getOneArticleReports } = ReportController;
const router = express.Router();
router.post('/:slug/reports', authUser, reportArticle);
router.get('/:slug/reports', authUser, verifyAdmin, getOneArticleReports);

export default router;
