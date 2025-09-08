"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const visitRepository_1 = __importDefault(require("../repositories/visitRepository"));
class VisitService {
    //Méthode principale : Créer visite + toutes ses actions
    static async create(data) {
        const { hiveId, visitActions, temperature, weather } = data;
        // Préparer données visite
        const visitData = {
            hiveId,
            date: new Date(),
            temperature: temperature || undefined,
            weather: weather || undefined
        };
        // Préparer actions formatées
        const formattedActions = Object.entries(visitActions).map(([actionId, value]) => ({
            actionId: parseInt(actionId),
            value: String(value)
        }));
        return await visitRepository_1.default.createWithActions(visitData, formattedActions);
    }
    //Méthode future : Récupérer toutes les visites d'une ruche
    static async findByHiveId(hiveId) {
        return await visitRepository_1.default.findAllByHive(hiveId);
    }
    //Méthode future : Récupérer une visite spécifique
    static async findById(id) {
        return await visitRepository_1.default.findById(id);
    }
    static async findAllByHive(hiveId) {
        return await visitRepository_1.default.findAllByHive(hiveId);
    }
}
exports.default = VisitService;
//# sourceMappingURL=visitService.js.map