"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiaryService_1 = __importDefault(require("../services/apiaryService"));
class ApiaryController {
    static async create(req, res) {
        const name = req.body.name;
        const address = req.body.address;
        const city = req.body.city;
        //TODO:changer l'id
        const apiary = await apiaryService_1.default.create(name, address, city, 1);
        res.json({ apiary });
    }
    static async findAll(req, res) {
        const apiaries = await apiaryService_1.default.findAll();
        //console.log(apiaries);
        res.json(apiaries);
    }
    static async delete(req, res) {
        try {
            //console.log("DELETE appelé");
            const id = parseInt(req.params.id); //bracket notation pour garder les bonne protique du guide zalando
            const apiaryDeleted = await apiaryService_1.default.delete(id);
            res.json(apiaryDeleted);
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.default = ApiaryController;
//# sourceMappingURL=apiaryController.js.map