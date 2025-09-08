"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../lib/prisma"));
class DashboardRepository {
    static async getApiaryCountByUser(userId) {
        return await prisma_1.default.apiary.count({
            where: { userId }
        });
    }
    static async getHiveStatsByUser(userId) {
        // Total des ruches de l'utilisateur
        const totalHives = await prisma_1.default.hive.count({
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
        const hivesByStatus = await prisma_1.default.hive.groupBy({
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
            hivesByStatus: Object.fromEntries(hivesByStatus.map(group => [group.status, group._count.status]))
        };
    }
    static async getVisitsThisMonthByUser(userId) {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        return await prisma_1.default.visit.count({
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
    static async getHivesWithoutRecentVisit(userId, daysSince = 15) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysSince);
        return await prisma_1.default.hive.findMany({
            where: {
                apiary_hives: {
                    some: {
                        apiary: { userId },
                        endDate: null
                    }
                },
                status: {
                    in: ['ACTIVE', 'WINTERING'] // Exclure ruches mortes/inactives/vides
                },
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
exports.default = DashboardRepository;
//# sourceMappingURL=dashboardRepository.js.map