import express, {Request, Response} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import ApiaryController from './src/controllers/apiaryController';
import HiveController from './src/controllers/hiveConroller';
import ActionController from './src/controllers/actionController';
import VisitController from './src/controllers/visitController';

dotenv.config()

const app = express();
const PORT = process.env.PORT;

//middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());


//Routes Rucher
app.post("/api/apiaries", ApiaryController.create);
app.get("/api/apiaries", ApiaryController.findAll);
app.delete("/api/apiaries/:id", ApiaryController.delete);
//Routes Ruche
app.get("/api/hives", HiveController.findAllByApiary);
app.post("/api/hives", HiveController.create);
app.get("/api/hives/:id", HiveController.findById)
//Routes pour la définition des actions
// Route unique qui gère 2 cas :
// - GET /api/actions → Toutes les actions (mode expert)  
// - GET /api/actions?filter=current → Actions filtrées selon période/météo/température (mode normal)
app.get("/api/actions", ActionController.findAll);
//Routes pour les visites
app.post("/api/visits", VisitController.create);

//route test
app.get("/", (req: Request, res: Response)=>{
  res.json({message: 'API Mellisync - Gestion de ruches'});
});

app.listen(PORT, () => {
  console.log(`Le serveur a bien démarrer sur : http://localhost:${PORT}`);
});