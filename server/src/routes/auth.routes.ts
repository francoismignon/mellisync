import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import AuthController from '../controllers/authController';

const router = Router();

// Routes d'authentification publiques
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);

// Routes d'authentification protégées
router.get('/me', authenticateToken, AuthController.me);

export default router;