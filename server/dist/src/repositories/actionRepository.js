"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../lib/prisma"));
class ActionRepository {
    static async findAllWithRelations() {
        return await prisma_1.default.action.findMany({
            include: {
                action_options: {
                    include: { option: true }
                },
                action_periodes: {
                    include: { periode: true }
                },
                action_weather_restrictions: {
                    include: { weatherRestriction: true }
                }
            },
            orderBy: { id: 'asc' }
        });
    }
    static async findById(id) {
        return await prisma_1.default.action.findUnique({
            where: { id },
            include: {
                action_options: {
                    include: { option: true }
                },
                action_periodes: {
                    include: { periode: true }
                },
                action_weather_restrictions: {
                    include: { weatherRestriction: true }
                }
            }
        });
    }
    static async findAllPeriods() {
        return await prisma_1.default.periode.findMany({
            orderBy: { id: 'asc' }
        });
    }
    static async findAllWeatherRestrictions() {
        return await prisma_1.default.weatherRestriction.findMany();
    }
    static async findPeriodByLabel(label) {
        return await prisma_1.default.periode.findFirst({
            where: { label }
        });
    }
    static async findWeatherRestrictionByCondition(condition) {
        return await prisma_1.default.weatherRestriction.findFirst({
            where: { label: { contains: condition, mode: 'insensitive' } }
        });
    }
}
exports.default = ActionRepository;
//# sourceMappingURL=actionRepository.js.map