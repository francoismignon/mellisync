import swaggerJSDoc from 'swagger-jsdoc';

/**
 * Configuration OpenAPI 3.0 pour Mellisync
 * Documentation automatisée des endpoints API
 */
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Mellisync API',
    version: '1.0.0',
    description: 'API REST pour la gestion de ruches et le suivi apicole',
    contact: {
      name: 'François Demol',
      email: 'francois@mellisync.com',
      url: 'https://mellisync.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Serveur de développement'
    },
    {
      url: 'https://api.mellisync.com',
      description: 'Serveur de production'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT obtenu via /api/auth/login'
      },
      CookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'mellisync_auth',
        description: 'Cookie sécurisé contenant le JWT'
      }
    },
    schemas: {
      // Schémas de base
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Message d\'erreur'
          },
          details: {
            type: 'string',
            description: 'Détails additionnels sur l\'erreur'
          }
        },
        required: ['error']
      },
      
      // Modèles métier
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'Identifiant unique utilisateur' },
          name: { type: 'string', description: 'Nom complet utilisateur' },
          email: { type: 'string', format: 'email', description: 'Adresse email' },
          role: { type: 'string', description: 'Rôle utilisateur (BEEKEEPER, ADMIN)' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      
      Apiary: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'Identifiant unique rucher' },
          name: { type: 'string', description: 'Nom du rucher' },
          address: { type: 'string', description: 'Adresse complète du rucher' },
          latitude: { type: 'number', format: 'double', description: 'Latitude GPS' },
          longitude: { type: 'number', format: 'double', description: 'Longitude GPS' },
          userId: { type: 'integer', description: 'ID propriétaire' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      
      Hive: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'Identifiant unique ruche' },
          name: { type: 'string', description: 'Nom de la ruche' },
          type: { 
            type: 'string', 
            enum: ['DADANT', 'LANGSTROTH', 'WARRE', 'KENYANE'],
            description: 'Type de ruche'
          },
          frameCount: {
            type: 'string',
            enum: ['FRAME_6', 'FRAME_8', 'FRAME_10', 'FRAME_12'],
            description: 'Nombre de cadres'
          },
          status: {
            type: 'string',
            enum: ['ACTIVE', 'INACTIVE', 'DEAD', 'SWARMED'],
            description: 'Statut de la ruche'
          },
          color: { type: 'string', description: 'Couleur de la ruche' },
          yearBuilt: { type: 'string', description: 'Année de construction' },
          qrCodeDataUrl: { type: 'string', description: 'QR Code en Data URL' },
          apiaryId: { type: 'integer', description: 'ID rucher parent' }
        }
      },
      
      Action: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'Identifiant unique action' },
          name: { type: 'string', description: 'Nom de l\'action apicole' },
          description: { type: 'string', description: 'Description détaillée' },
          temperatureMin: { type: 'number', nullable: true, description: 'Température minimum requise (°C)' },
          temperatureMax: { type: 'number', nullable: true, description: 'Température maximum autorisée (°C)' },
          action_periodes: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                periode: {
                  type: 'object',
                  properties: {
                    label: {
                      type: 'string',
                      enum: ['hiver', 'fin_hiver', 'miellée_printemps', 'inter_miellée', 'pré_traitement', 'traitement_été', 'préparation_hiver', 'traitement_hiver'],
                      description: 'Période apicole autorisée'
                    }
                  }
                }
              }
            }
          },
          action_weather_restrictions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                weatherRestriction: {
                  type: 'object',
                  properties: {
                    label: { type: 'string', description: 'Condition météo interdite' }
                  }
                }
              }
            }
          }
        }
      },
      
      Visit: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'Identifiant unique visite' },
          hiveId: { type: 'integer', description: 'ID ruche visitée' },
          userId: { type: 'integer', description: 'ID apiculteur' },
          visitDate: { type: 'string', format: 'date-time', description: 'Date/heure visite' },
          weather: { type: 'string', description: 'Conditions météo' },
          temperature: { type: 'number', description: 'Température (°C)' },
          observations: { type: 'string', description: 'Observations générales' },
          actionResults: {
            type: 'array',
            items: {
              type: 'object',
              description: 'Résultats des actions effectuées'
            }
          }
        }
      },
      
      AddressSuggestion: {
        type: 'object',
        properties: {
          display_name: { type: 'string', description: 'Nom complet affiché' },
          clean_address: { type: 'string', description: 'Adresse formatée proprement' },
          latitude: { type: 'number', format: 'double', description: 'Latitude' },
          longitude: { type: 'number', format: 'double', description: 'Longitude' }
        }
      },

      DashboardStats: {
        type: 'object',
        properties: {
          totalHives: { type: 'integer', description: 'Nombre total de ruches' },
          activeHives: { type: 'integer', description: 'Ruches actives' },
          totalApiaries: { type: 'integer', description: 'Nombre de ruchers' },
          recentVisits: { type: 'integer', description: 'Visites récentes' },
          pendingActions: { 
            type: 'array',
            items: { $ref: '#/components/schemas/Action' },
            description: 'Actions recommandées selon contexte actuel'
          },
          weatherAlert: {
            type: 'object',
            properties: {
              condition: { type: 'string', description: 'Condition météo actuelle' },
              temperature: { type: 'number', description: 'Température actuelle' },
              recommendation: { type: 'string', description: 'Recommandation apicole' }
            }
          }
        }
      }
    }
  },
  
  // Sécurité par défaut pour routes protégées
  security: [
    { BearerAuth: [] },
    { CookieAuth: [] }
  ]
};

const options = {
  definition: swaggerDefinition,
  // Chemins vers les fichiers contenant les annotations
  apis: [
    './index.ts',
    './src/controllers/*.ts',
    './src/routes/*.ts'
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;