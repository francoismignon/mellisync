import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import ApiaryController from './src/controllers/apiaryController';
dotenv.config();
const app = express();
const PORT = process.env.PORT;
const apiaryController = new ApiaryController();
//middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
//Routes Rucher
app.post("/api/apiaries", apiaryController.create);
app.get("/api/apiaries", apiaryController.findAll);
//route test
app.get("/", (req, res) => {
    res.json({ message: 'API Mellisync - Gestion de ruches' });
});
app.listen(PORT, () => {
    console.log(`Le serveur a bien démarrer sur : http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map