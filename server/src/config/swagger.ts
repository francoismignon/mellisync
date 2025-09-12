import swaggerJSDoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

// Configuration OpenAPI 3.0 pour Mellisync
const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Mellisync API',
    version: '1.0.0',
    description: 'API REST pour la gestion de ruches apicoles - Mellisync TFE 2025',
    contact: {
      name: 'François Mignon',
      email: 'mignon.francois@gmail.com',
    },
  },
  servers: [
    {
      url: process.env.API_URL || 'http://localhost:3000',
      description: 'Serveur de développement',
    },
    {
      url: 'https://api.mellisync.francoiscloud.duckdns.org',
      description: 'Serveur de production',
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'mellisync_auth',
        description: 'JWT Token dans cookie HttpOnly',
      },
    },
    schemas: {
      // Schémas de base
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'François Mignon' },
          email: { type: 'string', format: 'email', example: 'francois@mellisync.com' },
          roleId: { type: 'integer', example: 2 },
          role: { type: 'string', example: 'BEEKEEPER' },
        },
      },
      Apiary: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Rucher des Abeilles' },
          address: { type: 'string', example: 'Grand Place, 1000 Bruxelles' },
          latitude: { type: 'number', format: 'double', example: 50.8503 },
          longitude: { type: 'number', format: 'double', example: 4.3517 },
          userId: { type: 'integer', example: 1 },
          hiveCount: { type: 'integer', example: 5 },
        },
      },
      Hive: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Ruche Bleue' },
          type: { type: 'string', enum: ['DADANT', 'WARRÉ', 'KENYANE'], example: 'DADANT' },
          framecount: { type: 'integer', example: 10 },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'SWARM', 'DEAD'], example: 'ACTIVE' },
          color: { type: 'string', example: 'Bleue' },
          yearBuilt: { type: 'string', example: '2024' },
          qrCodeDataUrl: { type: 'string', format: 'uri', nullable: true },
          statusChangedAt: { type: 'string', format: 'date-time' },
        },
      },
      Visit: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          date: { type: 'string', format: 'date-time' },
          temperature: { type: 'number', example: 18.5 },
          weather: { type: 'string', example: 'Ensoleillé' },
          notes: { type: 'string', nullable: true },
          hiveId: { type: 'integer', example: 1 },
        },
      },
      Action: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Inspection couvain' },
          actionType: { type: 'string', enum: ['CYCLE', 'INCREMENT'], example: 'CYCLE' },
          temperatureMin: { type: 'number', nullable: true, example: 15 },
          temperatureMax: { type: 'number', nullable: true, example: 30 },
          weatherRestrictions: { type: 'array', items: { type: 'string' }, nullable: true },
        },
      },
      // Schémas de requête
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'francois@mellisync.com' },
          password: { type: 'string', format: 'password', example: 'motdepasse123' },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'François Mignon' },
          email: { type: 'string', format: 'email', example: 'francois@mellisync.com' },
          password: { type: 'string', format: 'password', example: 'motdepasse123' },
          roleId: { type: 'integer', example: 2, default: 2 },
        },
      },
      CreateApiaryRequest: {
        type: 'object',
        required: ['name', 'address'],
        properties: {
          name: { type: 'string', example: 'Rucher des Abeilles' },
          address: { type: 'string', example: 'Grand Place, 1000 Bruxelles' },
        },
      },
      CreateHiveRequest: {
        type: 'object',
        required: ['name', 'type', 'framecount', 'status', 'apiaryId'],
        properties: {
          name: { type: 'string', example: 'Ruche Bleue' },
          type: { type: 'string', enum: ['DADANT', 'WARRÉ', 'KENYANE'], example: 'DADANT' },
          framecount: { type: 'integer', example: 10 },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'], example: 'ACTIVE' },
          color: { type: 'string', example: 'Bleue' },
          yearBuilt: { type: 'string', example: '2024' },
          apiaryId: { type: 'integer', example: 1 },
        },
      },
      CreateVisitRequest: {
        type: 'object',
        required: ['hiveId', 'visitActions'],
        properties: {
          hiveId: { type: 'integer', example: 1 },
          visitActions: {
            type: 'object',
            additionalProperties: {
              oneOf: [
                { type: 'string' },
                { type: 'number' },
                { type: 'boolean' }
              ]
            },
            example: {
              '1': 'Oui',
              '2': 5,
              '3': 'Non'
            }
          },
        },
      },
      // Schémas de réponse
      AuthResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Connexion réussie' },
          user: { $ref: '#/components/schemas/User' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Message d\'erreur' },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Opération réussie' },
        },
      },
    },
  },
  // Sécurité par défaut : cookie JWT requis
  security: [
    {
      cookieAuth: [],
    },
  ],
};

// Options swagger-jsdoc
const options = {
  definition: swaggerDefinition,
  // Chemins vers les fichiers contenant les annotations OpenAPI
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
  ],
};

// Génération du spec OpenAPI
export const swaggerSpec = swaggerJSDoc(options);