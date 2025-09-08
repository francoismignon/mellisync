"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dashboardRepository_1 = __importDefault(require("../repositories/dashboardRepository"));
class DashboardService {
    // Statistiques de base pour un utilisateur
    static async getStatistics(userId) {
        try {
            const apiaryCount = await dashboardRepository_1.default.getApiaryCountByUser(userId);
            const hiveStats = await dashboardRepository_1.default.getHiveStatsByUser(userId);
            const visitsThisMonth = await dashboardRepository_1.default.getVisitsThisMonthByUser(userId);
            return {
                apiaryCount,
                totalHives: hiveStats.totalHives,
                hivesByStatus: hiveStats.hivesByStatus,
                visitsThisMonth
            };
        }
        catch (error) {
            console.error("Erreur calcul statistiques dashboard:", error);
            throw error;
        }
    }
    // Ruches sans visite depuis X jours
    static async getHivesWithoutVisit(userId, daysSince = 15) {
        try {
            return await dashboardRepository_1.default.getHivesWithoutRecentVisit(userId, daysSince);
        }
        catch (error) {
            console.error("Erreur calcul ruches sans visite:", error);
            throw error;
        }
    }
}
exports.default = DashboardService;
//# sourceMappingURL=dashboardService.js.map