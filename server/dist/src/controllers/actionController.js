"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionService_1 = __importDefault(require("../services/actionService"));
class ActionController {
    static async findAll(req, res) {
        try {
            const actions = await actionService_1.default.findAll();
            res.json(actions);
        }
        catch (error) {
            console.error("Error fetching actions:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
exports.default = ActionController;
//# sourceMappingURL=actionController.js.map