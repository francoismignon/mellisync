import { Request, Response } from 'express';
import AuthService from '../services/authService';

class AuthController {

  /**
   * POST /api/auth/register
   */
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, roleId } = req.body;

      // Validation basique
      if (!name || !email || !password) {
        return res.status(400).json({ 
          error: 'Nom, email et mot de passe requis' 
        });
      }

      if (password.length < 6) {
        return res.status(400).json({ 
          error: 'Le mot de passe doit contenir au moins 6 caractères' 
        });
      }

      const user = await AuthService.register(name, email, password, res, roleId);
      
      res.status(201).json({
        message: 'Inscription réussie',
        user
      });

    } catch (error: any) {
      console.error('Erreur inscription:', error);
      res.status(409).json({ 
        error: error.message || 'Erreur lors de l\'inscription' 
      });
    }
  }

  /**
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email et mot de passe requis' 
        });
      }

      const user = await AuthService.login(email, password, res);
      
      res.json({
        message: 'Connexion réussie',
        user
      });

    } catch (error: any) {
      console.error('Erreur connexion:', error);
      res.status(401).json({ 
        error: error.message || 'Erreur lors de la connexion' 
      });
    }
  }

  /**
   * POST /api/auth/logout
   */
  static async logout(req: Request, res: Response) {
    try {
      // Suppression du cookie HttpOnly
      AuthService.logout(res);
      
      res.json({ 
        message: 'Déconnexion réussie' 
      });
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la déconnexion' 
      });
    }
  }

  /**
   * GET /api/auth/me - Profil utilisateur courant
   */
  static async me(req: Request, res: Response) {
    try {
      // L'utilisateur sera disponible via middleware auth
      const user = (req as any).user;
      
      res.json({ user });
    } catch (error) {
      console.error('Erreur profil:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération du profil' 
      });
    }
  }
}

export default AuthController;