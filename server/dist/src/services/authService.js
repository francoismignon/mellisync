"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
class AuthService {
    static JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    static JWT_EXPIRES_IN = '24h';
    static SALT_ROUNDS = 12;
    // Paramètres cookies sécurisés
    static COOKIE_NAME = 'mellisync_auth';
    static COOKIE_OPTIONS = {
        httpOnly: true, // Protection XSS - JS ne peut pas lire
        secure: true, // HTTPS uniquement 
        sameSite: 'strict', // Protection CSRF
        maxAge: 24 * 60 * 60 * 1000, // 24h en milliseconds
        path: '/' // Disponible sur tout le site
    };
    /**
     * Inscription nouvel utilisateur avec cookie sécurisé
     */
    static async register(name, email, password, res, roleId) {
        // Vérifier si email existe déjà
        const existingUser = await userRepository_1.default.findByEmail(email);
        if (existingUser) {
            throw new Error('Un utilisateur avec cet email existe déjà');
        }
        // Utiliser rôle BEEKEEPER par défaut si non spécifié
        let finalRoleId = roleId;
        if (!finalRoleId) {
            const beekeeperRole = await userRepository_1.default.findDefaultBeekeeperRole();
            if (!beekeeperRole) {
                throw new Error('Rôle BEEKEEPER non trouvé');
            }
            finalRoleId = beekeeperRole.id;
        }
        // Hash mot de passe
        const hashedPassword = await bcryptjs_1.default.hash(password, this.SALT_ROUNDS);
        // Créer utilisateur
        const user = await userRepository_1.default.create({
            name,
            email,
            hashedPassword,
            roleId: finalRoleId
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
    static async login(email, password, res) {
        // Trouver utilisateur
        const user = await userRepository_1.default.findByEmail(email);
        if (!user) {
            throw new Error('Identifiants invalides');
        }
        // Vérifier mot de passe
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
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
    static logout(res) {
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
    static extractTokenFromCookies(cookies) {
        return cookies[this.COOKIE_NAME] || null;
    }
    /**
     * Vérifier JWT token
     */
    static async verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.JWT_SECRET);
            return decoded;
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Définir cookie d'authentification sécurisé
     */
    static setAuthCookie(res, token) {
        res.cookie(this.COOKIE_NAME, token, this.COOKIE_OPTIONS);
    }
    /**
     * Générer JWT token
     */
    static generateToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.JWT_SECRET, {
            expiresIn: this.JWT_EXPIRES_IN
        });
    }
    /**
     * Hash mot de passe (utilitaire pour migration)
     */
    static async hashPassword(password) {
        return await bcryptjs_1.default.hash(password, this.SALT_ROUNDS);
    }
}
exports.default = AuthService;
//# sourceMappingURL=authService.js.map