import { Request, Response } from "express";
import ApiaryService from '../services/apiaryService';


class ApiaryController {
  static async create(req: Request, res: Response) {
    try {
      const name: string = req.body.name;
      const address: string = req.body.address;
      const city: string = req.body.city;
      const userId = req.user!.id; // Garanti par middleware auth

      const apiary = await ApiaryService.create(name, address, city, userId);
      res.json({apiary});
    } catch (error) {
      console.error('Erreur création rucher:', error);
      res.status(500).json({ error: 'Erreur lors de la création du rucher' });
    }
  }

  static async findAll(req: Request, res: Response) {
    try {
      const userId = req.user!.id; // Garanti par middleware auth
      const apiaries = await ApiaryService.findAllByUser(userId);
      res.json(apiaries);
    } catch (error) {
      console.error('Erreur récupération ruchers:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des ruchers' });
    }
  }
}
export default ApiaryController;