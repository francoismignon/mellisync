import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import AuthController from '../controllers/authController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentification et gestion des sessions utilisateur
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Créer un nouveau compte utilisateur
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', AuthController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Se connecter avec email et mot de passe
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: mellisync_auth=jwt_token; HttpOnly; Secure; SameSite=Strict
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Identifiants incorrects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Email ou mot de passe manquant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Se déconnecter et supprimer le cookie de session
 *     tags: [Authentication]
 *     security: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: mellisync_auth=; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.post('/logout', AuthController.logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtenir les informations de l'utilisateur connecté
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Informations utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/me', authenticateToken, AuthController.me);

export default router;