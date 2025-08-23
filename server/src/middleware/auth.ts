import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/authService';
import prisma from '../lib/prisma';

// Extend Request type pour ajouter user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        name: string;
        roleId: number;
        role: string;
      };
    }
  }
}

/**
 * Middleware authentification JWT
 * Extrait le token depuis Authorization header et valide l'utilisateur
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Récupérer token depuis cookies HttpOnly
    const token = AuthService.extractTokenFromCookies(req.cookies);

    if (!token) {
      return res.status(401).json({ 
        error: 'Token d\'authentification requis' 
      });
    }

    // Vérifier token
    const payload = await AuthService.verifyToken(token);
    if (!payload) {
      return res.status(403).json({ 
        error: 'Token invalide ou expiré' 
      });
    }

    // Récupérer données utilisateur complètes
    const user = await prisma.user.findUnique({
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
  } catch (error) {
    console.error('Erreur middleware auth:', error);
    return res.status(500).json({ 
      error: 'Erreur interne d\'authentification' 
    });
  }
};

/**
 * Middleware autorisation par rôle
 * Usage: requireRole(['ADMIN', 'BEEKEEPER'])
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
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

/**
 * Middleware optionnel pour routes qui peuvent fonctionner avec/sans auth
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = AuthService.extractTokenFromCookies(req.cookies);

    if (token) {
      const payload = await AuthService.verifyToken(token);
      if (payload) {
        const user = await prisma.user.findUnique({
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
  } catch (error) {
    // En cas d'erreur, continue sans user (auth optionnelle)
    next();
  }
};