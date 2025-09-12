import { Router, Request, Response } from "express";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Test
 *   description: Routes de test et diagnostic système
 */

/**
 * @swagger
 * /api/test/test:
 *   get:
 *     summary: Test de connectivité API
 *     tags: [Test]
 *     security: []
 *     description: Route publique pour vérifier que l'API répond correctement
 *     responses:
 *       200:
 *         description: API fonctionnelle
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "API Mellisync fonctionne bien :)"
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-12T14:30:00.000Z"
 */
router.get('/test', (_req: Request, res: Response) =>{
    res.status(200).json({
        message : 'API Mellisync fonctionne bien :)',
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

export default router;