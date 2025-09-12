import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import ActionController from '../controllers/actionController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Actions
 *   description: Actions apicoles - Filtrage intelligent selon période et météo
 */

// Toutes les routes actions sont protégées
router.use(authenticateToken);

/**
 * @swagger
 * /api/actions:
 *   get:
 *     summary: Obtenir les actions apicoles disponibles
 *     tags: [Actions]
 *     description: |
 *       Deux modes d'utilisation :
 *       - **Mode Expert** : Sans paramètre `filter`, retourne toutes les actions disponibles
 *       - **Mode Saison** : Avec `filter=current`, retourne les actions filtrées selon la période apicole, météo et température du rucher spécifié
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [current]
 *         description: Si présent avec valeur "current", active le filtrage intelligent
 *         example: current
 *       - in: query
 *         name: apiaryId
 *         schema:
 *           type: integer
 *         description: ID du rucher pour récupérer météo localisée (requis si filter=current)
 *         example: 1
 *     responses:
 *       200:
 *         description: Actions disponibles
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - description: Mode Expert - Liste simple des actions
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Action'
 *                 - description: Mode Saison - Actions avec contexte métier
 *                   type: object
 *                   properties:
 *                     currentPeriod:
 *                       type: string
 *                       example: "traitement_été"
 *                       description: Période apicole actuelle (Wallonie)
 *                     currentTemperature:
 *                       type: number
 *                       example: 18.5
 *                       description: Température actuelle au rucher (°C)
 *                     currentWeather:
 *                       type: string
 *                       example: "Ensoleillé"
 *                       description: Conditions météo actuelles
 *                     actions:
 *                       type: array
 *                       description: Actions filtrées selon période/météo/température
 *                       items:
 *                         allOf:
 *                           - $ref: '#/components/schemas/Action'
 *                           - type: object
 *                             properties:
 *                               action_periodes:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     periode:
 *                                       type: object
 *                                       properties:
 *                                         label:
 *                                           type: string
 *                                           example: "traitement_été"
 *       400:
 *         description: apiaryId manquant en mode filtré ou paramètres invalides
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
router.get('/', ActionController.findAll);

export default router;