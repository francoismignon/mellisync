import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Response } from 'express';
import prisma from '../lib/prisma';

interface UserPayload {
  id: number;
  email: string;
  roleId: number;
}

interface AuthResult {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

class AuthService {
  
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  private static readonly JWT_EXPIRES_IN = '24h';
  private static readonly SALT_ROUNDS = 12;
  
  // Paramètres cookies sécurisés
  private static readonly COOKIE_NAME = 'mellisync_auth';
  private static readonly COOKIE_OPTIONS = {
    httpOnly: true,     // Protection XSS - JS ne peut pas lire
    secure: true,       // HTTPS uniquement 
    sameSite: 'strict' as const, // Protection CSRF
    maxAge: 24 * 60 * 60 * 1000, // 24h en milliseconds
    path: '/'           // Disponible sur tout le site
  };

  /**
   * Inscription nouvel utilisateur avec cookie sécurisé
   */
  static async register(name: string, email: string, password: string, res: Response, roleId: number = 2): Promise<AuthResult['user']> {
    // Vérifier si email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    // Hash mot de passe
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    // Créer utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId
      },
      include: {
        role: true
      }
    });

    // Générer JWT token
    const token = this.generateToken({
      id: user.id,
      email: user.email,
      roleId: user.roleId
    });

    // Définir cookie sécurisé
    this.setAuthCookie(res, token);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name
    };
  }

  /**
   * Connexion utilisateur avec cookie sécurisé
   */
  static async login(email: string, password: string, res: Response): Promise<AuthResult['user']> {
    // Trouver utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: true
      }
    });

    if (!user) {
      throw new Error('Identifiants invalides');
    }

    // Vérifier mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Identifiants invalides');
    }

    // Générer JWT token
    const token = this.generateToken({
      id: user.id,
      email: user.email,
      roleId: user.roleId
    });

    // Définir cookie sécurisé
    this.setAuthCookie(res, token);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name
    };
  }

  /**
   * Déconnexion utilisateur (supprime cookie)
   */
  static logout(res: Response): void {
    res.clearCookie(this.COOKIE_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/'
    });
  }

  /**
   * Extraire JWT token depuis cookies
   */
  static extractTokenFromCookies(cookies: any): string | null {
    return cookies[this.COOKIE_NAME] || null;
  }

  /**
   * Vérifier JWT token
   */
  static async verifyToken(token: string): Promise<UserPayload | null> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as UserPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Définir cookie d'authentification sécurisé
   */
  private static setAuthCookie(res: Response, token: string): void {
    res.cookie(this.COOKIE_NAME, token, this.COOKIE_OPTIONS);
  }

  /**
   * Générer JWT token
   */
  private static generateToken(payload: UserPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN
    });
  }

  /**
   * Hash mot de passe (utilitaire pour migration)
   */
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }
}

export default AuthService;