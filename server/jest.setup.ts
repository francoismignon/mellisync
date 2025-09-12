// Configuration globale des tests Jest
import 'reflect-metadata' // Requis pour certains décorateurs/DI si utilisés

// Extension des matchers Jest si nécessaire
// import '@testing-library/jest-dom/extend-expect'

// Timeout global des tests
jest.setTimeout(10000)

// Mock des méthodes console pour des sorties de test plus propres
global.console = {
  ...console,
  // Décommenter pour supprimer les console.log dans les tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

// Variables d'environnement mockées pour les tests
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/mellisync_test'