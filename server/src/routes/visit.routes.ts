import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import VisitController from '../controllers/visitController';

const router = Router();

// Toutes les routes visites sont protégées
router.use(authenticateToken);

// Routes CRUD visites
router.post('/', VisitController.create);
router.get('/:id/pdf', VisitController.generatePDF);

export default router;