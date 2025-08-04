import express, {Request, Response} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config()

const app = express();
const PORT = process.env.PORT;

//middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

//route test
app.get("/", (req: Request, res: Response)=>{
  res.json({message: 'API Mellisync - Gestion de ruches'});
});

app.listen(PORT, () => {
  console.log(`Le serveur a bien démarrer sur : http://localhost:${PORT}`);
});