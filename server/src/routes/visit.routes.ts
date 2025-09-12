import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import VisitController from '../controllers/visitController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Visits
 *   description: Gestion des visites apicoles - Création et génération PDF
 */

// Toutes les routes visites sont protégées
router.use(authenticateToken);

/**
 * @swagger
 * /api/visits:
 *   post:
 *     summary: Créer une nouvelle visite avec actions apicoles
 *     tags: [Visits]
 *     description: Crée une visite dans une ruche avec toutes les actions effectuées en transaction atomique
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVisitRequest'
 *     responses:
 *       201:
 *         description: Visite créée avec succès avec toutes ses actions
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Visit'
 *                 - type: object
 *                   properties:
 *                     visitActions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           actionId:
 *                             type: integer
 *                           value:
 *                             oneOf:
 *                               - type: string
 *                               - type: number
 *                               - type: boolean
 *                           notes:
 *                             type: string
 *                             nullable: true
 *       400:
 *         description: hiveId manquant ou actions invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Accès interdit à cette ruche
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', VisitController.create);

/**
 * @swagger
 * /api/visits/{id}/pdf:
 *   get:
 *     summary: Générer un rapport PDF officiel d'une visite
 *     tags: [Visits]
 *     description: Génère un document PDF A4 avec toutes les actions de la visite pour archivage officiel
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la visite
 *         example: 1
 *     responses:
 *       200:
 *         description: Document PDF généré
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *         headers:
 *           Content-Disposition:
 *             schema:
 *               type: string
 *               example: 'attachment; filename="visite-ruche-bleue-2025-09-12.pdf"'
 *           Content-Type:
 *             schema:
 *               type: string
 *               example: 'application/pdf'
 *       404:
 *         description: Visite non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Accès interdit à cette visite
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id/pdf', VisitController.generatePDF);

export default router;