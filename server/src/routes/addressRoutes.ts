import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import AddressController from '../controllers/addressController';

const router = Router();

// Toutes les routes addresses sont protégées
router.use(authenticateToken);

// Route pour recherche d'adresses avec autocomplétion
router.get('/suggestions', AddressController.getAddressSuggestions);

export default router;