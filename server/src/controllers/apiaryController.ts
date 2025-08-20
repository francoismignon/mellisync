import { Request, Response } from "express";
import ApiaryService from '../services/apiaryService';


class ApiaryController {
  static async create(req: Request, res: Response) {
    const name: string = req.body.name;
    const address: string = req.body.address;
    const city: string = req.body.city;

    //TODO:changer l'id
    const apiary = await ApiaryService.create(name, address, city, 1);
    res.json({apiary});
  }

  static async findAll(req: Request, res: Response) {
    const apiaries = await ApiaryService.findAll();
    //console.log(apiaries);
    res.json(apiaries);
  }

  static async delete(req: Request, res: Response) {
    try {
      //console.log("DELETE appelé");
      const id: number = parseInt(req.params.id);//bracket notation pour garder les bonne protique du guide zalando
      const apiaryDeleted = await ApiaryService.delete(id);
      res.json(apiaryDeleted);

    } catch (error) {
      console.log(error);
    }
  }
}
export default ApiaryController;