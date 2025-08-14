import { Request, Response } from "express";
import ApiaryService from '../services/apiaryService';


class ApiaryController {
  async create(req: Request, res: Response) {
    const name: string = req.body.name;
    const address: string = req.body.address;
    const city: string = req.body.city;

    //TODO:changer l'id
    const apiary = await ApiaryService.create(name, address, city, 1);

    res.json({apiary});
  }

  async findAll(req: Request, res: Response) {
    const apiaries = await ApiaryService.findAll();
    //console.log(apiaries);
    res.json(apiaries);
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    try {
      const apiaryDeleted = await ApiaryService.delete(id);
      res.json(apiaryDeleted);

    } catch (error) {
      console.log(error);
    }
  }
}
export default ApiaryController;