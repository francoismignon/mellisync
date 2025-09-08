"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.requireRole = exports.authenticateToken = void 0;
const authService_1 = __importDefault(require("../services/authService"));
const prisma_1 = __importDefault(require("../lib/prisma"));
/**
 * Middleware authentification JWT
 * Extrait le token depuis Authorization header et valide l'utilisateur
 */
const authenticateToken = async (req, res, next) => {
    try {
        // Récupérer token depuis cookies HttpOnly
        const token = authService_1.default.extractTokenFromCookies(req.cookies);
        if (!token) {
            return res.status(401).json({
                error: 'Token d\'authentification requis'
            });
        }
        // Vérifier token
        const payload = await authService_1.default.verifyToken(token);
        if (!payload) {
            return res.status(403).json({
                error: 'Token invalide ou expiré'
            });
        }
        // Récupérer données utilisateur complètes
        const user = await prisma_1.default.user.findUnique({
            where: { id: payload.id },
            include: {
                role: true
            }
        });
        if (!user) {
            return res.status(403).json({
                error: 'Utilisateur non trouvé'
            });
        }
        // Attacher user à la requête
        req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            roleId: user.roleId,
            role: user.role.name
        };
        next();
    }
    catch (error) {
        console.error('Erreur middleware auth:', error);
        return res.status(500).json({
            error: 'Erreur interne d\'authentification'
        });
    }
};
exports.authenticateToken = authenticateToken;
/**
 * Middleware autorisation par rôle
 * Usage: requireRole(['ADMIN', 'BEEKEEPER'])
 */
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: 'Authentification requise'
            });
        }
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                error: `Accès interdit. Rôles autorisés: ${allowedRoles.join(', ')}`
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
/**
 * Middleware optionnel pour routes qui peuvent fonctionner avec/sans auth
 */
const optionalAuth = async (req, res, next) => {
    try {
        const token = authService_1.default.extractTokenFromCookies(req.cookies);
        if (token) {
            const payload = await authService_1.default.verifyToken(token);
            if (payload) {
                const user = await prisma_1.default.user.findUnique({
                    where: { id: payload.id },
                    include: { role: true }
                });
                if (user) {
                    req.user = {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        roleId: user.roleId,
                        role: user.role.name
                    };
                }
            }
        }
        next();
    }
    catch (error) {
        // En cas d'erreur, continue sans user (auth optionnelle)
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map