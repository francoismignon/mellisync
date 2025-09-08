import DashboardRepository from "../repositories/dashboardRepository";

class DashboardService {
  
  // Statistiques de base pour un utilisateur
  static async getStatistics(userId: number) {
    try {
      const apiaryCount = await DashboardRepository.getApiaryCountByUser(userId);
      const hiveStats = await DashboardRepository.getHiveStatsByUser(userId);
      const visitsThisMonth = await DashboardRepository.getVisitsThisMonthByUser(userId);

      return {
        apiaryCount,
        totalHives: hiveStats.totalHives,
        hivesByStatus: hiveStats.hivesByStatus,
        visitsThisMonth
      };

    } catch (error) {
      console.error("Erreur calcul statistiques dashboard:", error);
      throw error;
    }
  }

  // Ruches sans visite depuis X jours
  static async getHivesWithoutVisit(userId: number, daysSince: number = 15) {
    try {
      return await DashboardRepository.getHivesWithoutRecentVisit(userId, daysSince);
    } catch (error) {
      console.error("Erreur calcul ruches sans visite:", error);
      throw error;
    }
  }
}

export default DashboardService;