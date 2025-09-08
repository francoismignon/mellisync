"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../lib/prisma"));
class VisitRepository {
    static async findById(id) {
        return await prisma_1.default.visit.findUnique({
            where: { id },
            include: {
                hive: {
                    include: {
                        apiary_hives: {
                            where: { endDate: null },
                            include: {
                                apiary: {
                                    select: { id: true, name: true, address: true, city: true }
                                }
                            }
                        }
                    }
                },
                visitActions: {
                    include: {
                        action: {
                            select: { id: true, label: true, actionType: true }
                        }
                    }
                }
            }
        });
    }
    static async createWithActions(visitData, visitActions) {
        return await prisma_1.default.$transaction(async (tx) => {
            // 1. Créer la visite
            const visit = await tx.visit.create({
                data: visitData,
            });
            // 2. Créer toutes les actions de visite
            if (visitActions.length > 0) {
                await tx.visitAction.createMany({
                    data: visitActions.map((va) => ({
                        visitId: visit.id,
                        actionId: va.actionId,
                        value: va.value,
                    })),
                });
            }
            // 3. Retourner la visite avec ses relations
            return await tx.visit.findUnique({
                where: { id: visit.id },
                include: {
                    visitActions: {
                        include: {
                            action: {
                                select: { id: true, label: true, actionType: true }
                            }
                        }
                    }
                }
            });
        });
    }
    static async findAllByHive(hiveId) {
        return await prisma_1.default.visit.findMany({
            where: { hiveId },
            include: {
                visitActions: {
                    include: {
                        action: {
                            select: { id: true, label: true, actionType: true }
                        }
                    }
                }
            },
            orderBy: { date: 'desc' }
        });
    }
    static async findAllByUser(userId) {
        return await prisma_1.default.visit.findMany({
            where: {
                hive: {
                    apiary_hives: {
                        some: {
                            apiary: {
                                userId: userId
                            },
                            endDate: null
                        }
                    }
                }
            },
            include: {
                hive: {
                    select: { id: true, name: true }
                },
                visitActions: {
                    include: {
                        action: {
                            select: { id: true, label: true }
                        }
                    }
                }
            },
            orderBy: { date: 'desc' }
        });
    }
    static async getVisitNumberForHive(hiveId, visitId) {
        const allVisitsForHive = await prisma_1.default.visit.findMany({
            where: { hiveId },
            select: { id: true },
            orderBy: { date: 'asc' }
        });
        return allVisitsForHive.findIndex(v => v.id === visitId) + 1;
    }
}
exports.default = VisitRepository;
//# sourceMappingURL=visitRepository.js.map