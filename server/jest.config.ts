import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  // Preset ts-jest pour support TypeScript
  preset: 'ts-jest',
  
  // Environnement de test Node.js
  testEnvironment: 'node',
  
  // Patterns des fichiers de test
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/*.test.ts'
  ],
  
  // Chemins des modules
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  
  // Configuration TypeScript
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  
  // Paramètres de couverture de code
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts', // Exclure le fichier d'entrée principal
    '!src/**/__tests__/**',
  ],
  
  // Fichiers de configuration
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
  // Timeout des tests (utile pour tests d'intégration)
  testTimeout: 10000,
  
  // Nettoyer les mocks entre les tests
  clearMocks: true,
  
  // Sortie détaillée
  verbose: true
}

export default jestConfig