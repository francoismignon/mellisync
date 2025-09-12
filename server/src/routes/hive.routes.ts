import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import HiveController from '../controllers/hiveConroller';
import VisitController from '../controllers/visitController';

const router = Router();

// Toutes les routes ruches sont protégées
router.use(authenticateToken);

// Routes CRUD ruches
router.get('/', HiveController.findAllByApiary);
router.post('/', HiveController.create);
router.get('/:id', HiveController.findById);

// Routes actions spécifiques ruches
router.get('/:id/visits', VisitController.findAllByHive);
router.get('/:id/transhumances', HiveController.getTranshumanceHistory);
router.post('/:id/move', HiveController.moveToApiary);
router.put('/:id/status', HiveController.updateStatus);
router.post('/:id/generate-qr', HiveController.generateQRCode);

export default router;