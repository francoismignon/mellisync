import express, {Request, Response} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import ApiaryController from './src/controllers/apiaryController';
import HiveController from './src/controllers/hiveConroller';
import ActionController from './src/controllers/actionController';
import VisitController from './src/controllers/visitController';
import AuthController from './src/controllers/authController';
import DashboardController from './src/controllers/dashboardController';
import { authenticateToken } from './src/middleware/auth';

dotenv.config()

const app = express();
const PORT = process.env.PORT;

//middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? `https://${process.env.WEB_DOMAIN}`
    : 'http://localhost:5173',
  credentials: true // Important pour les cookies
}));
app.use(morgan('combined'));
app.use(cookieParser()); // Middleware pour parser les cookies
app.use(express.json());


//Routes Rucher (protégées)
app.post("/api/apiaries", authenticateToken, ApiaryController.create);
app.get("/api/apiaries", authenticateToken, ApiaryController.findAll);

//Routes Ruche (protégées)
app.get("/api/hives", authenticateToken, HiveController.findAllByApiary);
app.post("/api/hives", authenticateToken, HiveController.create);
app.get("/api/hives/:id", authenticateToken, HiveController.findById)
app.get("/api/hives/:id/visits", authenticateToken, VisitController.findAllByHive);
app.get("/api/hives/:id/transhumances", authenticateToken, HiveController.getTranshumanceHistory);
app.post("/api/hives/:id/move", authenticateToken, HiveController.moveToApiary);
app.put("/api/hives/:id/status", authenticateToken, HiveController.updateStatus);
app.post("/api/hives/:id/generate-qr", authenticateToken, HiveController.generateQRCode);

//Routes pour la définition des actions (protégées)
// Route unique qui gère 2 cas :
// - GET /api/actions → Toutes les actions (mode expert)  
// - GET /api/actions?filter=current → Actions filtrées selon période/météo/température (mode normal)
app.get("/api/actions", authenticateToken, ActionController.findAll);

//Routes pour les visites (protégées)
app.post("/api/visits", authenticateToken, VisitController.create);
app.get("/api/visits/:id/pdf", authenticateToken, VisitController.generatePDF);

//Routes pour l'authentification
app.post("/api/auth/register", AuthController.register);
app.post("/api/auth/login", AuthController.login);
app.post("/api/auth/logout", AuthController.logout);
app.get("/api/auth/me", authenticateToken, AuthController.me);

//Route pour le dashboard
app.get("/api/dashboard", authenticateToken, DashboardController.getDashboardData);

//route test
app.get("/", (req: Request, res: Response)=>{
  res.json({message: 'API Mellisync - Gestion de ruches'});
});

app.listen(PORT, () => {
  console.log(`Le serveur a bien démarrer sur : http://localhost:${PORT}`);
});