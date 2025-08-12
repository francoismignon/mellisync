import { Request, Response } from "express";
import ApiaryService from '../services/apiaryService';


class ApiaryController{

    async create(req:Request, res: Response) {
        const name: string = req.body.name;
        const address: string = req.body.address;
        const city: string = req.body.city;

        const apiary = await ApiaryService.create(name, address, city, 1);

        res.json({message: "Rucher cree", apiary});
    }

    async findAll(req: Request, res: Response){
        const apiaries = await ApiaryService.findAll();
        //console.log(apiaries);
        res.json(apiaries);
    }

}
export default ApiaryController;