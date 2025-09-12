import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

// Import des routes modulaires
import apiRoutes from './src/routes';
import { swaggerSpec } from './src/config/swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middlewares globaux
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

// Documentation OpenAPI/Swagger
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Mellisync API Documentation',
  customfavIcon: '/assets/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
  }
}));

// Route pour servir le spec OpenAPI JSON
app.get('/api/openapi.json', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Routes API modulaires
app.use('/api', apiRoutes);

// Route racine de santé
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'API Mellisync - Gestion de ruches',
    version: '1.0.0',
    status: 'OK',
    timestamp: new Date().toISOString(),
    documentation: '/swagger',
    openapi: '/api/openapi.json'
  });
});

app.listen(PORT, () => {
  console.log(`Le serveur a bien démarrer sur : http://localhost:${PORT}`);
});