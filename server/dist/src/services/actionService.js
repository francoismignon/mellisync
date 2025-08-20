"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../lib/prisma"));
class ActionService {
    static async findAll() {
        return await prisma_1.default.action.findMany({
            include: {
                action_options: {
                    include: {
                        option: true,
                    },
                },
                action_periodes: {
                    include: {
                        periode: true,
                    },
                },
                action_weather_restrictions: {
                    include: {
                        weatherRestriction: true,
                    },
                },
            },
            orderBy: {
                id: "asc",
            },
        });
    }
}
exports.default = ActionService;
//# sourceMappingURL=actionService.js.map