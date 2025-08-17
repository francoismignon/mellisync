import express, {Request, Response} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import ApiaryController from './src/controllers/apiaryController';
import HiveController from './src/controllers/hiveConroller';

console.log("=== DEBUG ===");
console.log("ApiaryController:", ApiaryController);
console.log("ApiaryController.delete:", ApiaryController.delete);
console.log("typeof ApiaryController.delete:", typeof ApiaryController.delete);

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
app.get("/api/hives", HiveController.findAllByUser);

//route test
app.get("/", (req: Request, res: Response)=>{
  res.json({message: 'API Mellisync - Gestion de ruches'});
});

app.listen(PORT, () => {
  console.log(`Le serveur a bien démarrer sur : http://localhost:${PORT}`);
});