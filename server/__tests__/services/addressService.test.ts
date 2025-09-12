import AddressService from '../../src/services/addressService'

// Mock de fetch global
global.fetch = jest.fn()

const mockedFetch = fetch as jest.MockedFunction<typeof fetch>

describe('AddressService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('searchAddresses', () => {
    it('devrait retourner un tableau vide pour une requête trop courte', async () => {
      const result = await AddressService.searchAddresses('ab')
      
      expect(result).toEqual([])
      expect(mockedFetch).not.toHaveBeenCalled()
    })

    it('devrait retourner des suggestions pour une adresse belge valide', async () => {
      const mockNominatimResponse = [
        {
          place_id: 12345,
          lat: '50.8503',
          lon: '4.3517',
          display_name: 'Grand Place, Bruxelles-Ville, Bruxelles, Belgique',
          address: {
            house_number: '1',
            road: 'Grand Place',
            city: 'Bruxelles',
            postcode: '1000',
            country: 'Belgique',
            country_code: 'be'
          }
        }
      ]

      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockNominatimResponse)
      } as Response)

      const result = await AddressService.searchAddresses('Grand Place Bruxelles')

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        display_name: 'Grand Place, Bruxelles-Ville, Bruxelles, Belgique',
        clean_address: '1 Grand Place, 1000 Bruxelles, BE',
        latitude: 50.8503,
        longitude: 4.3517
      })
      
      expect(mockedFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://nominatim.openstreetmap.org/search'),
        expect.objectContaining({
          headers: {
            'User-Agent': 'Mellisync/1.0 (francois@mellisync.com)'
          }
        })
      )
    })

    it('devrait gérer une erreur API Nominatim', async () => {
      mockedFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      } as Response)

      const result = await AddressService.searchAddresses('adresse test')

      expect(result).toEqual([])
    })

    it('devrait gérer une exception réseau', async () => {
      mockedFetch.mockRejectedValueOnce(new Error('Erreur réseau'))

      const result = await AddressService.searchAddresses('adresse test')

      expect(result).toEqual([])
    })
  })

  describe('buildCleanAddress', () => {
    it('devrait construire une adresse propre avec tous les éléments', () => {
      const mockResult = {
        place_id: 12345,
        lat: '50.4500',
        lon: '3.9500',
        display_name: '123 Rue de la Paix, 7000 Mons, Belgique',
        address: {
          house_number: '123',
          road: 'Rue de la Paix',
          postcode: '7000',
          city: 'Mons',
          country_code: 'be'
        }
      }

      // Méthode privée - test indirect via searchAddresses
      // On va simplement vérifier que buildCleanAddress est appelée correctement
      // lors d'un appel à searchAddresses avec des données valides
      
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockResult])
      } as Response)

      return AddressService.searchAddresses('test').then(result => {
        expect(result).toHaveLength(1)
        expect(result[0]).toHaveProperty('clean_address')
        expect(result[0].clean_address).toBe('123 Rue de la Paix, 7000 Mons, BE')
      })
    })
  })
})