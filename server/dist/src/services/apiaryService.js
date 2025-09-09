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
    /**
     * Récupérer un rucher avec la météo locale (RBAC)
     */
    static async findByIdWithWeather(id, userId) {
        const apiary = await apiaryRepository_1.default.findByIdForUser(id, userId);
        if (!apiary) {
            return null;
        }
        // Récupérer la météo si les coordonnées sont disponibles
        let weather = null;
        if (apiary.latitude && apiary.longitude) {
            try {
                weather = await weatherService_1.default.getCurrentWeather(Number(apiary.latitude), Number(apiary.longitude));
            }
            catch (error) {
                console.error('Erreur récupération météo:', error);
                // On continue sans météo si l'API échoue
            }
        }
        return {
            ...apiary,
            weather
        };
    }
    static async create(name, address, latitude, longitude, userId) {
        return await apiaryRepository_1.default.create({
            name,
            address,
            city: '', // Plus utilisé, on garde le display_name complet dans address
            userId,
            latitude,
            longitude,
        });
    }
    /**
     * Récupérer tous les ruchers d'un utilisateur avec statistiques des ruches (RBAC)
     */
    static async findAllByUser(userId) {
        const apiaries = await apiaryRepository_1.default.findAllByUser(userId);
        // Enrichir avec les statistiques des ruches
        return apiaries.map(apiary => {
            const totalHives = apiary._count.apiary_hives;
            const hiveStatuses = apiary.apiary_hives.map(ah => ah.hive.status);
            const activeHives = hiveStatuses.filter(status => status === 'ACTIVE').length;
            const inactiveHives = hiveStatuses.filter(status => status === 'INACTIVE').length;
            return {
                id: apiary.id,
                name: apiary.name,
                address: apiary.address,
                city: apiary.city,
                latitude: apiary.latitude,
                longitude: apiary.longitude,
                createdAt: apiary.createdAt,
                updatedAt: apiary.updatedAt,
                userId: apiary.userId,
                hiveStats: {
                    total: totalHives,
                    active: activeHives,
                    inactive: inactiveHives
                }
            };
        });
    }
}
exports.default = ApiaryService;
//# sourceMappingURL=apiaryService.js.map