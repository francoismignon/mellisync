import { Request, Response } from 'express';
import ActionService from '../services/actionService';

class ActionController {
    // Gère les 2 modes (expert vs normal)
    static async findAll(req: Request, res: Response) {
        try {
            // 1️ Extraction des paramètres d'URL : ?filter=current&apiaryId=123
            const { filter, apiaryId } = req.query;
            
            // 2️ MODE NORMAL (débutant) : Actions pré-filtrées par règles métier
            if (filter === 'current') {
                // Appelle service avec logique filtrage intelligent + météo spécifique au rucher
                // Retourne : { currentPeriod, currentTemperature, currentWeather, actions[] }
                const apiaryIdNumber = apiaryId ? parseInt(apiaryId as string) : undefined;
                const filteredResult = await ActionService.findForVisit(apiaryIdNumber);
                return res.json(filteredResult);
            }
            
            // 3️ MODE EXPERT : Toutes les actions sans filtre
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