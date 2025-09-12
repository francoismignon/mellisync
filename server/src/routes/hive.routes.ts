import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import HiveController from '../controllers/hiveConroller';
import VisitController from '../controllers/visitController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Hives
 *   description: Gestion des ruches - CRUD, transhumances et QR codes
 */

// Toutes les routes ruches sont protégées
router.use(authenticateToken);

/**
 * @swagger
 * /api/hives:
 *   get:
 *     summary: Lister les ruches d'un rucher spécifique
 *     tags: [Hives]
 *     parameters:
 *       - in: query
 *         name: apiaryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du rucher dont on veut les ruches
 *         example: 1
 *     responses:
 *       200:
 *         description: Liste des ruches du rucher
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hive'
 *       400:
 *         description: apiaryId manquant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Accès interdit au rucher
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', HiveController.findAllByApiary);

/**
 * @swagger
 * /api/hives:
 *   post:
 *     summary: Créer une nouvelle ruche dans un rucher
 *     tags: [Hives]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateHiveRequest'
 *     responses:
 *       201:
 *         description: Ruche créée avec succès (QR code généré automatiquement)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hive:
 *                   $ref: '#/components/schemas/Hive'
 *       403:
 *         description: Accès interdit au rucher
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', HiveController.create);

/**
 * @swagger
 * /api/hives/{id}:
 *   get:
 *     summary: Obtenir les détails d'une ruche spécifique
 *     tags: [Hives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la ruche
 *         example: 1
 *     responses:
 *       200:
 *         description: Détails de la ruche avec rucher actuel
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Hive'
 *                 - type: object
 *                   properties:
 *                     apiary_hives:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           apiary:
 *                             $ref: '#/components/schemas/Apiary'
 *       404:
 *         description: Ruche non trouvée
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
router.get('/:id', HiveController.findById);

/**
 * @swagger
 * /api/hives/{id}/visits:
 *   get:
 *     summary: Obtenir l'historique des visites d'une ruche
 *     tags: [Hives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la ruche
 *         example: 1
 *     responses:
 *       200:
 *         description: Liste des visites de la ruche (plus récente en premier)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Visit'
 *       403:
 *         description: Accès interdit à cette ruche
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id/visits', VisitController.findAllByHive);

/**
 * @swagger
 * /api/hives/{id}/transhumances:
 *   get:
 *     summary: Obtenir l'historique des transhumances d'une ruche
 *     tags: [Hives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la ruche
 *         example: 1
 *     responses:
 *       200:
 *         description: Historique des déplacements de rucher
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                   reason:
 *                     type: string
 *                     enum: [ACQUISITION, PRODUCTION, WINTERING, POLLINATION, TREATMENT, INSPECTION]
 *                   note:
 *                     type: string
 *                     nullable: true
 *                   apiary:
 *                     $ref: '#/components/schemas/Apiary'
 *       403:
 *         description: Accès interdit à cette ruche
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id/transhumances', HiveController.getTranshumanceHistory);

/**
 * @swagger
 * /api/hives/{id}/move:
 *   post:
 *     summary: Déplacer une ruche vers un autre rucher (transhumance)
 *     tags: [Hives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la ruche à déplacer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newApiaryId
 *               - reason
 *             properties:
 *               newApiaryId:
 *                 type: integer
 *                 example: 2
 *                 description: ID du rucher de destination
 *               reason:
 *                 type: string
 *                 enum: [ACQUISITION, PRODUCTION, WINTERING, POLLINATION, TREATMENT, INSPECTION]
 *                 example: PRODUCTION
 *                 description: Raison de la transhumance
 *               note:
 *                 type: string
 *                 example: Déplacement pour miellée de tilleul
 *                 description: Note optionnelle sur la transhumance
 *     responses:
 *       200:
 *         description: Transhumance effectuée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ruche déplacée vers Rucher de Printemps"
 *                 transhumance:
 *                   type: object
 *                   properties:
 *                     apiary:
 *                       $ref: '#/components/schemas/Apiary'
 *       400:
 *         description: Données manquantes ou ruche déjà dans ce rucher
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Accès interdit à la ruche ou au rucher de destination
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:id/move', HiveController.moveToApiary);

/**
 * @swagger
 * /api/hives/{id}/status:
 *   put:
 *     summary: Modifier le statut d'une ruche
 *     tags: [Hives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la ruche
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newStatus
 *             properties:
 *               newStatus:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, SWARM, DEAD]
 *                 example: SWARM
 *                 description: Nouveau statut de la ruche
 *               note:
 *                 type: string
 *                 example: Essaimage naturel observé
 *                 description: Note optionnelle sur le changement de statut
 *     responses:
 *       200:
 *         description: Statut modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Statut de la ruche modifié vers SWARM"
 *                 hive:
 *                   $ref: '#/components/schemas/Hive'
 *       400:
 *         description: Nouveau statut manquant
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
router.put('/:id/status', HiveController.updateStatus);

/**
 * @swagger
 * /api/hives/{id}/generate-qr:
 *   post:
 *     summary: Générer ou régénérer le QR code d'une ruche
 *     tags: [Hives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la ruche
 *         example: 1
 *     responses:
 *       200:
 *         description: QR code généré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "QR Code généré avec succès"
 *                 hive:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Hive'
 *                     - type: object
 *                       properties:
 *                         qrCodeDataUrl:
 *                           type: string
 *                           description: Data URL du QR code généré
 *                           example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
 *       403:
 *         description: Accès interdit à cette ruche
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:id/generate-qr', HiveController.generateQRCode);

export default router;