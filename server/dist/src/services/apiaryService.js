"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiaryRepository_1 = __importDefault(require("../repositories/apiaryRepository"));
const weatherService_1 = __importDefault(require("./weatherService"));
class ApiaryService {
    static async findById(id) {
        return await apiaryRepository_1.default.findById(id);
    }
    static async create(name, address, city, userId) {
        // Géocodage automatique de l'adresse lors de la création
        const coordinates = await weatherService_1.default.geocodeAddress(address, city);
        return await apiaryRepository_1.default.create({
            name,
            address,
            city,
            userId,
            latitude: coordinates?.latitude || null,
            longitude: coordinates?.longitude || null,
        });
    }
    /**
     * Récupérer tous les ruchers d'un utilisateur (RBAC)
     */
    static async findAllByUser(userId) {
        return await apiaryRepository_1.default.findAllByUser(userId);
    }
}
exports.default = ApiaryService;
//# sourceMappingURL=apiaryService.js.map