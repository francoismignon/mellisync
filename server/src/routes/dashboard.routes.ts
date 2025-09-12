import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import DashboardController from '../controllers/dashboardController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Tableau de bord - Statistiques et alertes utilisateur
 */

// Toutes les routes dashboard sont protégées
router.use(authenticateToken);

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Obtenir les données du tableau de bord
 *     tags: [Dashboard]
 *     description: |
 *       Retourne un résumé complet de l'activité apicole de l'utilisateur avec :
 *       - Statistiques générales (nombre de ruchers, ruches, visites)
 *       - Alertes prioritaires (ruches sans visite récente)
 *       - Navigation rapide avec IDs pour accès direct
 *     responses:
 *       200:
 *         description: Données du tableau de bord avec statistiques et alertes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statistics:
 *                   type: object
 *                   description: Statistiques générales de l'exploitation
 *                   properties:
 *                     apiaryCount:
 *                       type: integer
 *                       example: 3
 *                       description: Nombre total de ruchers
 *                     totalHives:
 *                       type: integer
 *                       example: 15
 *                       description: Nombre total de ruches actives
 *                     visitsThisMonth:
 *                       type: integer
 *                       example: 12
 *                       description: Nombre de visites ce mois-ci
 *                 alerts:
 *                   type: object
 *                   description: Alertes et notifications importantes
 *                   properties:
 *                     hivesWithoutVisit:
 *                       type: array
 *                       description: Ruches nécessitant une visite (> 30 jours)
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 5
 *                             description: ID de la ruche pour navigation
 *                           name:
 *                             type: string
 *                             example: "Ruche Bleue"
 *                             description: Nom de la ruche
 *                           daysSinceLastVisit:
 *                             type: integer
 *                             example: 45
 *                             description: Jours depuis dernière visite
 *                           apiary:
 *                             type: string
 *                             example: "Rucher de Printemps"
 *                             description: Nom du rucher
 *                           apiaryId:
 *                             type: integer
 *                             example: 2
 *                             description: ID du rucher pour navigation
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', DashboardController.getDashboardData);

export default router;