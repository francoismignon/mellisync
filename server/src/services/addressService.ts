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
  address: string;
  city: string;
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
      const url = `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&countrycodes=BE&limit=5&addressdetails=1`;
      
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
        .map(result => {
          // Extraire ville depuis address ou display_name
          const city = result.address?.city || 
                      result.address?.town || 
                      result.address?.village || 
                      result.address?.municipality || 
                      this.extractCityFromDisplayName(result.display_name!);
          
          // Construire adresse propre
          const addressParts = [];
          if (result.address?.house_number) addressParts.push(result.address.house_number);
          if (result.address?.road) addressParts.push(result.address.road);
          const address = addressParts.join(' ') || result.display_name!.split(',')[0];
          
          return {
            display_name: result.display_name!,
            address: address,
            city: city,
            latitude: parseFloat(result.lat!),
            longitude: parseFloat(result.lon!)
          };
        });
      
    } catch (error) {
      console.error('Error in searchAddresses:', error);
      return [];
    }
  }
  
  //Extraire ville depuis display_name si address incomplet
  private static extractCityFromDisplayName(displayName: string): string {
    // Format typique: "Rue Example, 1000 Bruxelles, Belgique"
    const parts = displayName.split(',').map(p => p.trim());
    
    // Chercher partie avec code postal + ville
    for (const part of parts) {
      const match = part.match(/^\d{4}\s+(.+)$/);
      if (match) {
        return match[1]; // Ville après code postal
      }
    }
    
    // Fallback: avant-dernière partie (avant pays)
    if (parts.length >= 2) {
      return parts[parts.length - 2];
    }
    
    return parts[0] || 'Ville inconnue';
  }
}

export default AddressService;