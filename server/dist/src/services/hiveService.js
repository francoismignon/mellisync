"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hiveRepository_1 = __importDefault(require("../repositories/hiveRepository"));
const apiaryRepository_1 = __importDefault(require("../repositories/apiaryRepository"));
const qrcode_1 = __importDefault(require("qrcode"));
class HiveService {
    static async findById(id) {
        return await hiveRepository_1.default.findById(id);
    }
    static async findAllByApiary(apiaryId) {
        return await hiveRepository_1.default.findAllByApiary(apiaryId);
    }
    static async createByApiary(apiaryId, hiveData) {
        // 1. Créer la ruche avec transaction Repository
        const hive = await hiveRepository_1.default.createWithApiary(apiaryId, hiveData);
        // 2. Générer QR code si possible
        try {
            const hiveUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/ruchers/${apiaryId}/ruches/${hive.id}`;
            const qrCodeDataUrl = await qrcode_1.default.toDataURL(hiveUrl, {
                errorCorrectionLevel: 'M',
                width: 256,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });
            // 3. Mettre à jour avec QR code
            return await hiveRepository_1.default.updateQRCode(hive.id, qrCodeDataUrl);
        }
        catch (qrError) {
            console.error('Erreur génération QR code:', qrError);
            // Retourner la ruche même si QR code échoue (fallback gracieux)
            return hive;
        }
    }
    static async getTranshumanceHistory(hiveId) {
        return await hiveRepository_1.default.getTranshumanceHistory(hiveId);
    }
    static async getVisitsHistory(hiveId) {
        return await hiveRepository_1.default.getVisitsHistory(hiveId);
    }
    static async generateQRCode(hiveId) {
        // 1. Récupérer la ruche pour obtenir l'apiaryId
        const hive = await hiveRepository_1.default.findById(hiveId);
        if (!hive || !hive.apiary_hives?.[0]) {
            throw new Error('Ruche non trouvée ou sans rucher associé');
        }
        const apiaryId = hive.apiary_hives[0].apiary.id;
        // 2. Générer QR code avec URL complète  
        const hiveUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/ruchers/${apiaryId}/ruches/${hive.id}`;
        const qrCodeDataUrl = await qrcode_1.default.toDataURL(hiveUrl, {
            errorCorrectionLevel: 'M',
            width: 256,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        // 3. Sauvegarder et retourner
        return await hiveRepository_1.default.updateQRCode(hiveId, qrCodeDataUrl);
    }
    static async updateStatus(id, status, userId, reason) {
        // Vérification RBAC : s'assurer que la ruche appartient à l'utilisateur
        const hive = await hiveRepository_1.default.findById(id);
        if (!hive || !hive.apiary_hives?.[0]) {
            throw new Error('Ruche non trouvée');
        }
        // Vérifier ownership via le rucher
        const apiary = await apiaryRepository_1.default.findByIdForUser(hive.apiary_hives[0].apiary.id, userId);
        if (!apiary) {
            throw new Error('Accès non autorisé à cette ruche');
        }
        return await hiveRepository_1.default.updateStatus(id, status, reason);
    }
    static async moveHive(hiveId, newApiaryId, reason, userId, note) {
        // Vérification RBAC : vérifier ownership des deux ruchers
        const hive = await hiveRepository_1.default.findById(hiveId);
        if (!hive || !hive.apiary_hives?.[0]) {
            throw new Error('Ruche non trouvée');
        }
        // Vérifier ownership rucher source
        const currentApiary = await apiaryRepository_1.default.findByIdForUser(hive.apiary_hives[0].apiary.id, userId);
        if (!currentApiary) {
            throw new Error('Accès non autorisé à la ruche source');
        }
        // Vérifier ownership rucher destination
        const targetApiary = await apiaryRepository_1.default.findByIdForUser(newApiaryId, userId);
        if (!targetApiary) {
            throw new Error('Accès non autorisé au rucher de destination');
        }
        return await hiveRepository_1.default.moveToApiary(hiveId, newApiaryId, reason, note);
    }
    static async findAllByUser(userId) {
        return await hiveRepository_1.default.findAllByUser(userId);
    }
}
exports.default = HiveService;
//# sourceMappingURL=hiveService.js.map