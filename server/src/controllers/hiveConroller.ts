import ApiaryService from "../services/apiaryService";
import HiveService from "../services/hiveService";
import { Request, Response } from "express";

class HiveController {

  static async findById(req: Request, res: Response){
    try {
      const hiveId = parseInt(req.params.id);
      const hive = await HiveService.findById(hiveId);
      res.status(201).json(hive);
    } catch (error) {
      console.log(error);
    }
  }


  static async findAllByApiary(req: Request, res: Response) {
    try {
      const userId = req.user!.id; // Garanti par middleware auth
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
      const userId = req.user!.id; // Garanti par middleware auth

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
