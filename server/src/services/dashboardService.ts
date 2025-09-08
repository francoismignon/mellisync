import prisma from "../lib/prisma";

class DashboardService {
  
  // Statistiques de base pour un utilisateur
  static async getStatistics(userId: number) {
    try {
      // Comptage des ruchers
      const apiaryCount = await prisma.apiary.count({
        where: { userId: userId }
      });

      // Comptage des ruches avec répartition par statut
      const hiveStats = await prisma.hive.groupBy({
        by: ['status'],
        where: {
          apiary_hives: {
            some: {
              endDate: null, // Ruches actuellement dans un rucher de l'utilisateur
              apiary: {
                userId: userId
              }
            }
          }
        },
        _count: {
          id: true
        }
      });

      // Total ruches
      const totalHives = hiveStats.reduce((sum, stat) => sum + stat._count.id, 0);

      // Répartition par statut
      const hivesByStatus = hiveStats.reduce((acc, stat) => {
        acc[stat.status] = stat._count.id;
        return acc;
      }, {} as Record<string, number>);

      // Visites ce mois (depuis le 1er du mois courant)
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const visitsThisMonth = await prisma.visit.count({
        where: {
          date: {
            gte: startOfMonth
          },
          hive: {
            apiary_hives: {
              some: {
                endDate: null,
                apiary: {
                  userId: userId
                }
              }
            }
          }
        }
      });

      return {
        apiaryCount,
        totalHives,
        hivesByStatus,
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
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysSince);

      // Trouver toutes les ruches productives de l'utilisateur (ignorer DEAD, EMPTY, INACTIVE)
      const userHives = await prisma.hive.findMany({
        where: {
          apiary_hives: {
            some: {
              endDate: null,
              apiary: {
                userId: userId
              }
            }
          },
          // Filtrer uniquement les ruches qui nécessitent un suivi régulier
          status: {
            in: ['ACTIVE', 'WINTERING', 'QUARANTINE'] // Ruches nécessitant des visites régulières
          }
        },
        include: {
          apiary_hives: {
            where: { endDate: null },
            include: {
              apiary: {
                select: { id: true, name: true, city: true }
              }
            }
          },
          visits: {
            orderBy: { date: 'desc' },
            take: 1, // Dernière visite seulement
            select: { date: true }
          }
        }
      });

      // Filtrer les ruches sans visite récente
      const hivesWithoutRecentVisit = userHives.filter(hive => {
        if (hive.visits.length === 0) {
          // Aucune visite = alerte
          return true;
        }
        
        const lastVisit = hive.visits[0].date;
        return lastVisit < cutoffDate;
      });

      // Formater pour l'affichage
      return hivesWithoutRecentVisit.map(hive => ({
        id: hive.id,
        name: hive.name,
        apiary: hive.apiary_hives[0].apiary,
        apiaryId: hive.apiary_hives[0].apiary.id, // Pour navigation frontend
        lastVisitDate: hive.visits[0]?.date || null,
        daysSinceLastVisit: hive.visits[0]?.date 
          ? Math.floor((Date.now() - hive.visits[0].date.getTime()) / (1000 * 60 * 60 * 24))
          : null
      }));

    } catch (error) {
      console.error("Erreur calcul ruches sans visite:", error);
      throw error;
    }
  }
}

export default DashboardService;