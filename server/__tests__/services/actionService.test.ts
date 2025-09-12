import ActionService from '../../src/services/actionService'

// Mock du repository
jest.mock('../../src/repositories/actionRepository')
jest.mock('../../src/services/weatherService')

describe('ActionService', () => {
  describe('getCurrentPeriod', () => {
    it('devrait retourner "hiver" pour janvier', () => {
      // Mock de la date pour janvier
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2025-01-15'))

      const period = ActionService.getCurrentPeriod()
      expect(period).toBe('hiver')

      // Restaurer les timers
      jest.useRealTimers()
    })

    it('devrait retourner "fin_hiver" pour mars', () => {
      // Mock de la date pour mars
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2025-03-15'))

      const period = ActionService.getCurrentPeriod()
      expect(period).toBe('fin_hiver')

      jest.useRealTimers()
    })

    it('devrait retourner "traitement_été" pour septembre', () => {
      // Mock de la date pour septembre (période actuelle)
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2025-09-15'))

      const period = ActionService.getCurrentPeriod()
      expect(period).toBe('traitement_été')

      jest.useRealTimers()
    })
  })

  describe('filterActionsByRules', () => {
    const mockActions = [
      {
        id: 1,
        name: 'Inspection couvain',
        temperatureMin: 15,
        temperatureMax: null,
        action_periodes: [
          { periode: { label: 'miellée_printemps' } }
        ],
        action_weather_restrictions: []
      },
      {
        id: 2,
        name: 'Traitement acide oxalique',
        temperatureMin: null,
        temperatureMax: 8,
        action_periodes: [
          { periode: { label: 'traitement_hiver' } }
        ],
        action_weather_restrictions: []
      },
      {
        id: 3,
        name: 'Ouverture ruche printemps',
        temperatureMin: null,
        temperatureMax: null,
        action_periodes: [
          { periode: { label: 'miellée_printemps' } }
        ],
        action_weather_restrictions: [
          { weatherRestriction: { label: 'Pluie' } }
        ]
      }
    ]

    it('devrait filtrer les actions selon la période', () => {
      const weatherData = { temperature: 18, condition: 'Ensoleillé' }
      const filtered = ActionService.filterActionsByRules(
        mockActions, 
        'miellée_printemps', 
        weatherData
      )

      // Actions 1 et 3 doivent passer (même période, condition ensoleillé)
      expect(filtered).toHaveLength(2)
      expect(filtered.map(a => a.id)).toContain(1)
      expect(filtered.map(a => a.id)).toContain(3)
    })

    it('devrait filtrer les actions selon la température minimum', () => {
      const weatherData = { temperature: 10, condition: 'Ensoleillé' }
      const filtered = ActionService.filterActionsByRules(
        mockActions, 
        'miellée_printemps', 
        weatherData
      )

      // Action 1 filtrée (temp trop basse), action 3 passe (pas de limite temp)
      expect(filtered).toHaveLength(1)
      expect(filtered[0].id).toBe(3)
    })

    it('devrait filtrer les actions selon les restrictions météo', () => {
      const weatherData = { temperature: 18, condition: 'Pluie' }
      const filtered = ActionService.filterActionsByRules(
        mockActions, 
        'miellée_printemps', 
        weatherData
      )

      // Action 1 passe (pas de restriction pluie), action 3 filtrée par la pluie
      expect(filtered).toHaveLength(1)
      expect(filtered[0].id).toBe(1)
    })
  })
})