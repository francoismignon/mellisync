"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../lib/prisma"));
class UserRepository {
    static async findByEmail(email) {
        return await prisma_1.default.user.findUnique({
            where: { email },
            include: { role: true }
        });
    }
    static async findById(id) {
        return await prisma_1.default.user.findUnique({
            where: { id },
            include: { role: true }
        });
    }
    static async create(data) {
        return await prisma_1.default.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.hashedPassword,
                roleId: data.roleId
            },
            include: { role: true }
        });
    }
    static async findDefaultBeekeeperRole() {
        return await prisma_1.default.role.findUnique({
            where: { name: "BEEKEEPER" }
        });
    }
}
exports.default = UserRepository;
//# sourceMappingURL=userRepository.js.map