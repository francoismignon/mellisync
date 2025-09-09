import prisma from "../lib/prisma";

class DashboardRepository {

  static async getApiaryCountByUser(userId: number) {
    return await prisma.apiary.count({
      where: { userId }
    });
  }

  static async getHiveStatsByUser(userId: number) {
    // Total des ruches de l'utilisateur
    const totalHives = await prisma.hive.count({
      where: {
        apiary_hives: {
          some: {
            apiary: { userId },
            endDate: null // Ruches actuelles uniquement
          }
        }
      }
    });

    // Répartition par statut
    const hivesByStatus = await prisma.hive.groupBy({
      by: ['status'],
      _count: { status: true },
      where: {
        apiary_hives: {
          some: {
            apiary: { userId },
            endDate: null
          }
        }
      }
    });

    return {
      totalHives,
      hivesByStatus: Object.fromEntries(
        hivesByStatus.map(group => [group.status, group._count.status])
      )
    };
  }

  static async getVisitsThisMonthByUser(userId: number) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    return await prisma.visit.count({
      where: {
        date: { gte: startOfMonth },
        hive: {
          apiary_hives: {
            some: {
              apiary: { userId },
              endDate: null
            }
          }
        }
      }
    });
  }

  static async getHivesWithoutRecentVisit(userId: number, daysSince: number = 15) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysSince);

    return await prisma.hive.findMany({
      where: {
        apiary_hives: {
          some: {
            apiary: { userId },
            endDate: null
          }
        },
        status: 'ACTIVE', // Seules les ruches actives génèrent des alertes
        OR: [
          {
            visits: {
              none: {} // Aucune visite
            }
          },
          {
            visits: {
              none: {
                date: { gte: cutoffDate } // Aucune visite récente
              }
            }
          }
        ]
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
          select: { date: true },
          orderBy: { date: 'desc' },
          take: 1
        }
      }
    });
  }
}

export default DashboardRepository;