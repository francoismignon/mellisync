import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import ActionController from '../controllers/actionController';

const router = Router();

// Toutes les routes actions sont protégées
router.use(authenticateToken);

// Route unique qui gère 2 cas :
// - GET /api/actions → Toutes les actions (mode expert)  
// - GET /api/actions?filter=current → Actions filtrées selon période/météo/température (mode normal)
router.get('/', ActionController.findAll);

export default router;