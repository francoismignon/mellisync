import { Router } from "express";
const router = Router();
router.get('/test', (req, res) => {
    res.status(200).json({
        message: 'API Mellisync fonctionne bien :)',
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});
export default router;
//# sourceMappingURL=test.js.map