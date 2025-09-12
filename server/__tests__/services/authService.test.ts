import AuthService from '../../src/services/authService'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Mock des dépendances
jest.mock('bcryptjs')
jest.mock('jsonwebtoken')
jest.mock('../../src/repositories/userRepository')

import UserRepository from '../../src/repositories/userRepository'

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>
const mockedJwt = jwt as jest.Mocked<typeof jwt>
const mockedUserRepository = UserRepository as jest.Mocked<typeof UserRepository>

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('hashPassword', () => {
    it('devrait hasher un mot de passe correctement', async () => {
      const password = 'motdepasse123'
      const hashedPassword = 'hashed_password_123'
      
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never)

      const result = await AuthService.hashPassword(password)

      expect(mockedBcrypt.hash).toHaveBeenCalledWith(password, 12)
      expect(result).toBe(hashedPassword)
    })
  })

  describe('verifyToken', () => {
    it('devrait décoder un token valide', async () => {
      const token = 'valid_jwt_token'
      const decoded = { id: 123, email: 'test@example.com', roleId: 1 }
      
      mockedJwt.verify.mockReturnValue(decoded as never)

      const result = await AuthService.verifyToken(token)

      expect(mockedJwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET)
      expect(result).toEqual(decoded)
    })

    it('devrait retourner null pour un token invalide', async () => {
      const token = 'invalid_token'
      
      mockedJwt.verify.mockImplementation(() => {
        throw new Error('Token invalide')
      })

      const result = await AuthService.verifyToken(token)
      expect(result).toBeNull()
    })
  })

  describe('extractTokenFromCookies', () => {
    it('devrait extraire le token depuis les cookies', () => {
      const cookies = { mellisync_auth: 'jwt_token_from_cookie' }
      
      const result = AuthService.extractTokenFromCookies(cookies)
      
      expect(result).toBe('jwt_token_from_cookie')
    })

    it('devrait retourner null si pas de cookie', () => {
      const cookies = {}
      
      const result = AuthService.extractTokenFromCookies(cookies)
      
      expect(result).toBeNull()
    })
  })
})