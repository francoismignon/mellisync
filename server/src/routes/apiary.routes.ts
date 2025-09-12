import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import ApiaryController from '../controllers/apiaryController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Apiaries
 *   description: Gestion des ruchers - Localisation et métadonnées
 */

// Toutes les routes ruchers sont protégées
router.use(authenticateToken);

/**
 * @swagger
 * /api/apiaries:
 *   post:
 *     summary: Créer un nouveau rucher
 *     tags: [Apiaries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateApiaryRequest'
 *     responses:
 *       201:
 *         description: Rucher créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rucher créé avec succès"
 *                 apiary:
 *                   $ref: '#/components/schemas/Apiary'
 *       400:
 *         description: Données invalides ou géocodage échoué
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
router.post('/', ApiaryController.create);

/**
 * @swagger
 * /api/apiaries:
 *   get:
 *     summary: Lister tous mes ruchers
 *     tags: [Apiaries]
 *     responses:
 *       200:
 *         description: Liste des ruchers appartenant à l'utilisateur connecté
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Apiary'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', ApiaryController.findAll);

/**
 * @swagger
 * /api/apiaries/{id}:
 *   get:
 *     summary: Obtenir les détails d'un rucher spécifique
 *     tags: [Apiaries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du rucher
 *         example: 1
 *     responses:
 *       200:
 *         description: Détails du rucher
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Apiary'
 *       404:
 *         description: Rucher non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Accès interdit - rucher n'appartient pas à l'utilisateur
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
router.get('/:id', ApiaryController.findById);

export default router;