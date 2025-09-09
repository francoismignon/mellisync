"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiaryService_1 = __importDefault(require("../services/apiaryService"));
const hiveService_1 = __importDefault(require("../services/hiveService"));
class HiveController {
    static async findById(req, res) {
        try {
            const hiveId = parseInt(req.params.id);
            const hive = await hiveService_1.default.findById(hiveId);
            res.status(201).json(hive);
        }
        catch (error) {
            console.log(error);
        }
    }
    static async findAllByApiary(req, res) {
        try {
            const userId = req.user.id; // Garanti par middleware auth
            const apiaryId = parseInt(req.query.apiaryId);
            if (!apiaryId) {
                return res.status(400).json({ error: "apiaryId requis" });
            }
            // Vérification RBAC
            const apiary = await apiaryService_1.default.findById(apiaryId);
            if (!apiary) {
                return res.status(404).json({ error: "Rucher non trouvé" });
            }
            if (apiary.userId !== userId) {
                return res.status(403).json({ error: "Accès interdit" });
            }
            const hives = await hiveService_1.default.findAllByApiary(apiaryId);
            res.json(hives);
        }
        catch (error) {
            console.log(error);
        }
    }
    static async create(req, res) {
        try {
            const { name, type, framecount, status, color, yearBuilt } = req.body;
            const apiaryId = parseInt(req.body.apiaryId);
            const userId = req.user.id; // Garanti par middleware auth
            //Vérification RBAC avant création
            const apiary = await apiaryService_1.default.findById(apiaryId);
            if (!apiary || apiary.userId !== userId) {
                return res.status(403).json({ error: "Accès interdit à ce rucher" });
            }
            const hive = await hiveService_1.default.createByApiary(apiaryId, {
                name,
                type,
                framecount,
                status,
                color,
                yearBuilt
            });
            res.status(201).json({ hive });
        }
        catch (error) {
            console.log(error);
        }
    }
    // Récupérer l'historique des transhumances d'une ruche
    static async getTranshumanceHistory(req, res) {
        try {
            const hiveId = parseInt(req.params.id);
            const userId = req.user.id; // Garanti par middleware auth
            // Vérification RBAC - s'assurer que l'utilisateur possède cette ruche
            const hive = await hiveService_1.default.findById(hiveId);
            if (!hive || !hive.apiary_hives?.[0]?.apiary) {
                return res.status(404).json({ error: "Ruche non trouvée" });
            }
            // Vérifier que l'utilisateur possède le rucher courant
            const currentApiary = hive.apiary_hives[0].apiary;
            const fullApiary = await apiaryService_1.default.findById(currentApiary.id);
            if (!fullApiary || fullApiary.userId !== userId) {
                return res.status(403).json({ error: "Accès interdit à cette ruche" });
            }
            const history = await hiveService_1.default.getTranshumanceHistory(hiveId);
            res.json(history);
        }
        catch (error) {
            console.error("Erreur récupération historique transhumance:", error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }
    // Déplacer une ruche vers un autre rucher
    static async moveToApiary(req, res) {
        try {
            const hiveId = parseInt(req.params.id);
            const { newApiaryId, reason, note } = req.body;
            const userId = req.user.id;
            // Validation des données
            if (!newApiaryId || !reason) {
                return res.status(400).json({
                    error: "newApiaryId et reason sont requis"
                });
            }
            // Vérification RBAC - la ruche appartient-elle à l'utilisateur ?
            const hive = await hiveService_1.default.findById(hiveId);
            if (!hive || !hive.apiary_hives?.[0]?.apiary) {
                return res.status(404).json({ error: "Ruche non trouvée" });
            }
            const currentApiary = hive.apiary_hives[0].apiary;
            const fullCurrentApiary = await apiaryService_1.default.findById(currentApiary.id);
            if (!fullCurrentApiary || fullCurrentApiary.userId !== userId) {
                return res.status(403).json({
                    error: "Accès interdit à cette ruche"
                });
            }
            // Vérification RBAC - le rucher de destination appartient-il à l'utilisateur ?
            const targetApiary = await apiaryService_1.default.findById(newApiaryId);
            if (!targetApiary || targetApiary.userId !== userId) {
                return res.status(403).json({
                    error: "Rucher de destination non trouvé ou accès interdit"
                });
            }
            // Empêcher déplacement vers le même rucher
            if (currentApiary.id === newApiaryId) {
                return res.status(400).json({
                    error: "La ruche est déjà dans ce rucher"
                });
            }
            // Effectuer le déplacement
            const transhumance = await hiveService_1.default.moveHive(hiveId, newApiaryId, reason, req.user.id, note);
            res.status(200).json({
                message: `Ruche déplacée vers ${transhumance.apiary.name}`,
                transhumance
            });
        }
        catch (error) {
            console.error("Erreur déplacement ruche:", error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }
    // Modifier le statut d'une ruche
    static async updateStatus(req, res) {
        try {
            const hiveId = parseInt(req.params.id);
            const { newStatus, note } = req.body;
            const userId = req.user.id;
            // Validation des données
            if (!newStatus) {
                return res.status(400).json({
                    error: "newStatus est requis"
                });
            }
            // Vérification RBAC - la ruche appartient-elle à l'utilisateur ?
            const hive = await hiveService_1.default.findById(hiveId);
            if (!hive || !hive.apiary_hives?.[0]?.apiary) {
                return res.status(404).json({ error: "Ruche non trouvée" });
            }
            const currentApiary = hive.apiary_hives[0].apiary;
            const fullCurrentApiary = await apiaryService_1.default.findById(currentApiary.id);
            if (!fullCurrentApiary || fullCurrentApiary.userId !== userId) {
                return res.status(403).json({
                    error: "Accès interdit à cette ruche"
                });
            }
            // Effectuer la modification
            const updatedHive = await hiveService_1.default.updateStatus(hiveId, newStatus, userId, note);
            res.status(200).json({
                message: `Statut de la ruche modifié vers ${newStatus}`,
                hive: updatedHive
            });
        }
        catch (error) {
            console.error("Erreur modification statut ruche:", error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }
    // Générer QR code pour une ruche existante
    static async generateQRCode(req, res) {
        try {
            const hiveId = parseInt(req.params.id);
            const userId = req.user.id;
            // Vérification RBAC - la ruche appartient-elle à l'utilisateur ?
            const hive = await hiveService_1.default.findById(hiveId);
            if (!hive || !hive.apiary_hives?.[0]?.apiary) {
                return res.status(404).json({ error: "Ruche non trouvée" });
            }
            const currentApiary = hive.apiary_hives[0].apiary;
            const fullCurrentApiary = await apiaryService_1.default.findById(currentApiary.id);
            if (!fullCurrentApiary || fullCurrentApiary.userId !== userId) {
                return res.status(403).json({
                    error: "Accès interdit à cette ruche"
                });
            }
            // Générer le QR code
            const updatedHive = await hiveService_1.default.generateQRCode(hiveId);
            res.status(200).json({
                message: "QR Code généré avec succès",
                hive: updatedHive
            });
        }
        catch (error) {
            console.error("Erreur génération QR code:", error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }
}
exports.default = HiveController;
//# sourceMappingURL=hiveConroller.js.map