"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../lib/prisma"));
class ApiaryService {
    static async create(name, address, city, userId) {
        return await prisma_1.default.apiary.create({
            data: {
                name,
                address,
                city,
                userId
            }
        });
    }
    //TODO: adapter lors d' l'authentification
    static async findAll() {
        return await prisma_1.default.apiary.findMany();
    }
    static async delete(id) {
        return await prisma_1.default.apiary.delete({
            where: { id }
        });
    }
}
exports.default = ApiaryService;
//# sourceMappingURL=apiaryService.js.map