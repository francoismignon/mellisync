import { Request, Response } from 'express';
import ActionService from '../services/actionService';

class ActionController {
    // 🎮 CONTROLLER PRINCIPAL : Gère les 2 modes (expert vs normal)
    static async findAll(req: Request, res: Response) {
        try {
            // 1️⃣ Extraction du paramètre d'URL : ?filter=current
            const { filter } = req.query;
            
            // 2️⃣ MODE NORMAL (débutant) : Actions pré-filtrées par règles métier
            if (filter === 'current') {
                // Appelle service avec logique filtrage intelligent
                // Retourne : { currentPeriod, currentTemperature, currentWeather, actions[] }
                const filteredResult = await ActionService.findForVisit();
                return res.json(filteredResult);
            }
            
            // 3️⃣ MODE EXPERT : Toutes les actions sans filtre
            // Retourne : actions[] (format classique)
            const actions = await ActionService.findAll();
            res.json(actions);
        } catch (error) {
            console.error("Error fetching actions:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    
}
export default ActionController;