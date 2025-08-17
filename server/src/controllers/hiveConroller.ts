import ApiaryService from "../services/apiaryService";
import HiveService from "../services/hiveService";
import { Request, Response } from "express";

class HiveController {
  static async findAllByApiary(req: Request, res: Response) {
    try {
      // TODO: const userId = req.user.id;
      const userId = 1; // temporaire
      const apiaryId = parseInt(req.query.apiaryId as string);

      if (!apiaryId) {
        return res.status(400).json({ error: "apiaryId requis" });
      }

      // Vérification RBAC
      const apiary = await ApiaryService.findById(apiaryId);
      if (!apiary) {
        return res.status(404).json({ error: "Rucher non trouvé" });
      }
      if (apiary.userId !== userId) {
        return res.status(403).json({ error: "Accès interdit" });
      }

      const hives = await HiveService.findAllByApiary(apiaryId);
      res.json(hives);
    } catch (error) {
      console.log(error);
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, type, framecount, status, color, yearBuilt } = req.body;
      const apiaryId = parseInt(req.body.apiaryId);
      // TODO: const userId = req.user.id; // depuis JWT token
      const userId = 1; //TODO: temporaire a effecer apres RBAC

      //Vérification RBAC avant création
      const apiary = await ApiaryService.findById(apiaryId);
      if (!apiary || apiary.userId !== userId) {
        return res.status(403).json({ error: "Accès interdit à ce rucher" });
      }

      const hive = await HiveService.createByApiary(apiaryId, {
        name,
        type,
        framecount,
        status,
        color,
        yearBuilt
      });
      res.status(201).json({ hive });
    } catch (error) {
      console.log(error);
    }
  }
}
export default HiveController;
