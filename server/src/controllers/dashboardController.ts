import { Request, Response } from "express";
import DashboardService from "../services/dashboardService";

class DashboardController {

  // Endpoint principal du dashboard avec toutes les données
  static async getDashboardData(req: Request, res: Response) {
    try {
      const userId = req.user!.id; // Garanti par middleware auth

      // 1. Statistiques de base
      const statistics = await DashboardService.getStatistics(userId);

      // 2. Alertes ruches sans visite
      const alertHives = await DashboardService.getHivesWithoutVisit(userId, 15);

      res.json({
        statistics,
        alerts: {
          hivesWithoutVisit: alertHives
        }
      });

    } catch (error) {
      console.error("Erreur dashboard:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
}

export default DashboardController;