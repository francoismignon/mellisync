"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../lib/prisma"));
class ApiaryRepository {
    static async findAllByUser(userId) {
        return await prisma_1.default.apiary.findMany({
            where: { userId },
            orderBy: { name: 'asc' }
        });
    }
    static async findById(id) {
        return await prisma_1.default.apiary.findUnique({
            where: { id }
        });
    }
    static async findByIdForUser(id, userId) {
        return await prisma_1.default.apiary.findFirst({
            where: {
                id,
                userId
            }
        });
    }
    static async create(data) {
        return await prisma_1.default.apiary.create({
            data
        });
    }
    static async update(id, data) {
        return await prisma_1.default.apiary.update({
            where: { id },
            data
        });
    }
    static async delete(id) {
        return await prisma_1.default.apiary.delete({
            where: { id }
        });
    }
}
exports.default = ApiaryRepository;
//# sourceMappingURL=apiaryRepository.js.map