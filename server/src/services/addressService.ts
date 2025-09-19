//Service pour intégration API Nominatim (géocodage adresses Belgique)

//Interface pour réponse Nominatim search
interface NominatimSearchResponse {
  place_id?: number;
  licence?: string;
  osm_type?: string;
  osm_id?: number;
  lat?: string;
  lon?: string;
  display_name?: string;
  address?: {
    house_number?: string;
    road?: string;
    village?: string;
    town?: string;
    city?: string;
    municipality?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
}

//Interface pour suggestion d'adresse
interface AddressSuggestion {
  display_name: string;
  clean_address: string;
  latitude: number;
  longitude: number;
}

class AddressService {
  
  //Recherche d'adresses via Nominatim API avec suggestions
  static async searchAddresses(query: string): Promise<AddressSuggestion[]> {
    try {
      if (!query || query.trim().length < 3) {
        return [];
      }

      // Encoder la requête pour URL
      const encodedQuery = encodeURIComponent(query.trim());
      const url = `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&countrycodes=BE,NO&limit=5&addressdetails=1`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mellisync/1.0 (francois@mellisync.com)' // Politique d'usage Nominatim
        }
      });
      
      if (!response.ok) {
        console.error(`Nominatim API error: ${response.status}`);
        return [];
      }
      
      const data: NominatimSearchResponse[] = await response.json();
      
      if (!data || data.length === 0) {
        console.warn(`No address results for query: ${query}`);
        return [];
      }
      
      // Transformer réponse Nominatim en suggestions utilisables
      return data
        .filter(result => result.lat && result.lon && result.display_name)
        .map(result => ({
          display_name: result.display_name!,
          clean_address: this.buildCleanAddress(result),
          latitude: parseFloat(result.lat!),
          longitude: parseFloat(result.lon!)
        }));
      
    } catch (error) {
      console.error('Error in searchAddresses:', error);
      return [];
    }
  }
  
  //Construire une adresse propre et lisible
  private static buildCleanAddress(result: NominatimSearchResponse): string {
    const address = result.address;
    const addressParts = [];
    
    // 1. Numéro + rue
    if (address?.house_number && address?.road) {
      addressParts.push(`${address.house_number} ${address.road}`);
    } else if (address?.road) {
      addressParts.push(address.road);
    }
    
    // 2. Code postal + ville
    const cityParts = [];
    if (address?.postcode) {
      cityParts.push(address.postcode);
    }
    
    // Priorité ville : city > town > village > municipality
    const city = address?.city || address?.town || address?.village || address?.municipality;
    if (city) {
      cityParts.push(city);
    }
    
    if (cityParts.length > 0) {
      addressParts.push(cityParts.join(' '));
    }
    
    // 3. Code pays simple
    if (address?.country_code) {
      addressParts.push(address.country_code.toUpperCase());
    }
    
    // Fallback si pas d'adresse structurée : prendre les 3 premiers éléments du display_name
    if (addressParts.length === 0 && result.display_name) {
      const parts = result.display_name.split(',').map(p => p.trim());
      return parts.slice(0, 3).join(', ');
    }
    
    return addressParts.join(', ').replace(/,$/, ''); // Supprimer virgule finale
  }
}

export default AddressService;