import { Request, Response } from "express";
import ApiaryService from '../services/apiaryService';


class ApiaryController {
  static async create(req: Request, res: Response) {
    try {
      const { name, address, latitude, longitude } = req.body;
      const userId = req.user!.id; // Garanti par middleware auth

      if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ error: 'Nom, adresse et coordonnées GPS sont requis' });
      }

      const apiary = await ApiaryService.create(name, address, latitude, longitude, userId);
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

  static async findById(req: Request, res: Response) {
    try {
      const apiaryId = parseInt(req.params.id);
      const userId = req.user!.id; // Garanti par middleware auth
      
      const apiary = await ApiaryService.findByIdWithWeather(apiaryId, userId);
      
      if (!apiary) {
        return res.status(404).json({ error: 'Rucher non trouvé' });
      }
      
      res.json(apiary);
    } catch (error) {
      console.error('Erreur récupération rucher:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération du rucher' });
    }
  }
}
export default ApiaryController;