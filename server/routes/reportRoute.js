import express from 'express';
import ReportController from '../controllers/reportController';
import Auth from '../middlewares/jwtAuthentication';

const { authUser } = Auth;
const { reportArticle, getAllReports } = ReportController;
const router = express.Router();
router.post('/:slug/reports', authUser, reportArticle);
router.get('/:slug/reports', authUser, getAllReports);

export default router;
