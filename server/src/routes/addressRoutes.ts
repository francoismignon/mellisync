import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import AddressController from '../controllers/addressController';

const router = Router();

// Route pour recherche d'adresses avec autocomplétion
router.get('/suggestions', authenticateToken, AddressController.getAddressSuggestions);

export default router;