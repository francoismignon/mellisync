import HiveService from "../services/hiveService";
import { Request, Response } from "express";

class HiveController{
    
    static async findAllByUser(req: Request, res: Response){
        try {
        //TODO modifier l'ID utilisateur apres avoir implementé l'authentification JWT
        const hives = await HiveService.findAllByUser(1);
        res.json(hives);
        } catch (error) {
            console.log(error);
        }
    };

}
export default HiveController;