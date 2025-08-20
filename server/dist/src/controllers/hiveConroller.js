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
            // TODO: const userId = req.user.id;
            const userId = 1; // temporaire
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
            // TODO: const userId = req.user.id; // depuis JWT token
            const userId = 1; //TODO: temporaire a effecer apres RBAC
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
}
exports.default = HiveController;
//# sourceMappingURL=hiveConroller.js.map