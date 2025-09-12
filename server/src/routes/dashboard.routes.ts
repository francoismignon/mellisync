import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import DashboardController from '../controllers/dashboardController';

const router = Router();

// Toutes les routes dashboard sont protégées
router.use(authenticateToken);

// Route dashboard principal
router.get('/', DashboardController.getDashboardData);

export default router;