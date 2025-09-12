import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import ApiaryController from '../controllers/apiaryController';

const router = Router();

// Toutes les routes ruchers sont protégées
router.use(authenticateToken);

// Routes CRUD ruchers
router.post('/', ApiaryController.create);
router.get('/', ApiaryController.findAll);
router.get('/:id', ApiaryController.findById);

export default router;