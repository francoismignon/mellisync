"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiaryService_1 = __importDefault(require("../services/apiaryService"));
class ApiaryController {
    static async create(req, res) {
        try {
            const name = req.body.name;
            const address = req.body.address;
            const city = req.body.city;
            const userId = req.user.id; // Garanti par middleware auth
            const apiary = await apiaryService_1.default.create(name, address, city, userId);
            res.json({ apiary });
        }
        catch (error) {
            console.error('Erreur création rucher:', error);
            res.status(500).json({ error: 'Erreur lors de la création du rucher' });
        }
    }
    static async findAll(req, res) {
        try {
            const userId = req.user.id; // Garanti par middleware auth
            const apiaries = await apiaryService_1.default.findAllByUser(userId);
            res.json(apiaries);
        }
        catch (error) {
            console.error('Erreur récupération ruchers:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération des ruchers' });
        }
    }
}
exports.default = ApiaryController;
//# sourceMappingURL=apiaryController.js.map