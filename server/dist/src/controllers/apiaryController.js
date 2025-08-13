import ApiaryService from '../services/apiaryService';
class ApiaryController {
    async create(req, res) {
        const name = req.body.name;
        const address = req.body.address;
        const city = req.body.city;
        const apiary = await ApiaryService.create(name, address, city, 1);
        res.json({ message: "Rucher cree", apiary });
    }
    async findAll(req, res) {
        const apiaries = await ApiaryService.findAll();
        //console.log(apiaries);
        res.json(apiaries);
    }
}
export default ApiaryController;
//# sourceMappingURL=apiaryController.js.map