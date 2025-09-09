"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../lib/prisma"));
class HiveRepository {
    static async findById(id) {
        return await prisma_1.default.hive.findUnique({
            where: { id },
            include: {
                apiary_hives: {
                    where: { endDate: null }, // Rucher actuel
                    include: {
                        apiary: {
                            select: { id: true, name: true, address: true, city: true }
                        }
                    }
                }
            }
        });
    }
    static async findAllByApiary(apiaryId) {
        return await prisma_1.default.hive.findMany({
            where: {
                apiary_hives: {
                    some: {
                        apiaryId: apiaryId,
                        endDate: null, // ruches actuellement dans ce rucher
                    },
                },
            },
        });
    }
    static async findAllByUser(userId) {
        return await prisma_1.default.hive.findMany({
            where: {
                apiary_hives: {
                    some: {
                        apiary: {
                            userId: userId,
                        },
                        endDate: null, // Ruches actuelles seulement
                    },
                },
            },
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
        });
    }
    static async createWithApiary(apiaryId, hiveData) {
        return await prisma_1.default.$transaction(async (tx) => {
            // 1. Créer d'abord la ruche
            const hive = await tx.hive.create({
                data: hiveData,
            });
            // 2. Créer la relation apiary-hive
            await tx.apiaryHive.create({
                data: {
                    hiveId: hive.id,
                    apiaryId,
                },
            });
            return hive;
        });
    }
    static async updateQRCode(hiveId, qrCodeDataUrl) {
        return await prisma_1.default.hive.update({
            where: { id: hiveId },
            data: { qrCodeDataUrl },
        });
    }
    static async updateStatus(id, status, reason) {
        return await prisma_1.default.hive.update({
            where: { id },
            data: {
                status: status,
                statusReason: reason,
                statusChangedAt: new Date()
            }
        });
    }
    static async moveToApiary(hiveId, newApiaryId, reason, note) {
        return await prisma_1.default.$transaction(async (tx) => {
            // 1. Fermer la relation actuelle (fin de période dans ce rucher)
            await tx.apiaryHive.updateMany({
                where: {
                    hiveId,
                    endDate: null, // relation active actuelle
                },
                data: { endDate: new Date() },
            });
            // 2. Créer nouvelle relation dans le nouveau rucher
            return await tx.apiaryHive.create({
                data: {
                    hiveId,
                    apiaryId: newApiaryId,
                    reason: reason,
                    note,
                },
                include: {
                    apiary: {
                        select: { id: true, name: true, address: true, city: true }
                    }
                }
            });
        });
    }
    static async getTranshumanceHistory(hiveId) {
        return await prisma_1.default.apiaryHive.findMany({
            where: { hiveId },
            include: {
                apiary: {
                    select: { id: true, name: true, address: true, city: true }
                }
            },
            orderBy: { startDate: 'desc' }
        });
    }
    static async getVisitsHistory(hiveId) {
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
}
exports.default = HiveRepository;
//# sourceMappingURL=hiveRepository.js.map