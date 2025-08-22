import { Request, Response } from 'express';
import VisitService from "../services/visitService";

class VisitController{
    static async create(req: Request, res: Response){
        try {
            // 🔍 Récupération body
            const { hiveId, visitActions } = req.body;
            
            // ✅ Validation basique
            if (!hiveId || !visitActions || typeof visitActions !== 'object') {
                return res.status(400).json({ 
                    error: "hiveId et visitActions sont requis" 
                });
            }
            
            // 🚀 Appel service avec données validées
            const visit = await VisitService.create({
                hiveId,
                visitActions
            });
            
            res.status(201).json(visit);
        } catch (error) {
            console.error("Erreur création visite:", error);
            res.status(500).json({
                error: "Erreur serveur lors de la création de la visite" 
            });
        }
    }

    static async findAllByHive(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const visits = await VisitService.findAllByHive(id);
            res.status(200).json(visits);
        } catch (error) {
            console.error("Erreur récupération visites:", error);
            res.status(500).json();
        }
    }
}
export default VisitController;