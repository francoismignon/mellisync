"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dashboardService_1 = __importDefault(require("../services/dashboardService"));
class DashboardController {
    // Endpoint principal du dashboard avec toutes les données
    static async getDashboardData(req, res) {
        try {
            const userId = req.user.id; // Garanti par middleware auth
            // 1. Statistiques de base
            const statistics = await dashboardService_1.default.getStatistics(userId);
            // 2. Alertes ruches sans visite
            const alertHives = await dashboardService_1.default.getHivesWithoutVisit(userId, 15);
            res.json({
                statistics,
                alerts: {
                    hivesWithoutVisit: alertHives
                }
            });
        }
        catch (error) {
            console.error("Erreur dashboard:", error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }
}
exports.default = DashboardController;
//# sourceMappingURL=dashboardController.js.map