import { Request, Response } from 'express';
import ActionService from '../services/actionService';

class ActionController {
    static async findAll(req: Request, res: Response) {
        try {
            const actions = await ActionService.findAll();
            res.json(actions);
        } catch (error) {
            console.error("Error fetching actions:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    
}
export default ActionController;