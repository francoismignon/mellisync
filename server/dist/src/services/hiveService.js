"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../lib/prisma"));
class HiveService {
    static async findById(id) {
        return await prisma_1.default.hive.findUnique({
            where: { id: id }
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
    static async createByApiary(apiaryId, hiveData) {
        //on cree d'abord la ruche
        const hive = await prisma_1.default.hive.create({
            data: hiveData,
        });
        //on cree ensuite la relatioin
        await prisma_1.default.apiaryHive.create({
            data: {
                hiveId: hive.id,
                apiaryId,
            },
        });
        return hive;
    }
}
exports.default = HiveService;
//# sourceMappingURL=hiveService.js.map