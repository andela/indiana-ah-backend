import { Router } from 'express';
import ReadingStatisticsController from '../controllers/ReadingStatisticsController';
import Auth from '../middlewares/jwtAuthentication';

const { getReadingStatistics } = ReadingStatisticsController;
const { authUser } = Auth;

const router = Router();

router.get('/', authUser, getReadingStatistics);

export default router;
