import { Router, Request, Response } from "express";

const router = Router();

router.get('/test', (req: Request, res: Response) =>{
    res.status(200).json({
        message : 'API Mellisync fonctionne bien :)',
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});
export default router;