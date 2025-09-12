import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import AddressController from '../controllers/addressController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: Géocodage et autocomplétion d'adresses via Nominatim
 */

// Toutes les routes addresses sont protégées
router.use(authenticateToken);

/**
 * @swagger
 * /api/addresses/suggestions:
 *   get:
 *     summary: Autocomplétion d'adresses géocodées
 *     tags: [Addresses]
 *     description: |
 *       Recherche d'adresses en temps réel via l'API Nominatim OpenStreetMap.
 *       Retourne jusqu'à 5 suggestions avec coordonnées GPS exactes pour création de ruchers.
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 3
 *         description: Début d'adresse à rechercher (minimum 3 caractères)
 *         example: "Grand Place Brux"
 *     responses:
 *       200:
 *         description: Liste des suggestions d'adresses avec géocodage
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               maxItems: 5
 *               items:
 *                 type: object
 *                 properties:
 *                   display_name:
 *                     type: string
 *                     example: "Grand Place, 1000 Bruxelles, BE"
 *                     description: Adresse formatée lisible
 *                   formatted_address:
 *                     type: string
 *                     example: "Grand Place, 1000 Bruxelles, BE"
 *                     description: Adresse normalisée Mellisync
 *                   lat:
 *                     type: string
 *                     example: "50.8503396"
 *                     description: Latitude GPS (format string Nominatim)
 *                   lon:
 *                     type: string
 *                     example: "4.3517103"
 *                     description: Longitude GPS (format string Nominatim)
 *                   place_id:
 *                     type: integer
 *                     example: 282214831
 *                     description: ID unique Nominatim de l'adresse
 *       400:
 *         description: Query manquant ou trop court (< 3 caractères)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/suggestions', AddressController.getAddressSuggestions);

export default router;