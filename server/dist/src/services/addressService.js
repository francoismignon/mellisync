"use strict";
//Service pour intégration API Nominatim (géocodage adresses Belgique)
Object.defineProperty(exports, "__esModule", { value: true });
class AddressService {
    //Recherche d'adresses via Nominatim API avec suggestions
    static async searchAddresses(query) {
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
            const data = await response.json();
            if (!data || data.length === 0) {
                console.warn(`No address results for query: ${query}`);
                return [];
            }
            // Transformer réponse Nominatim en suggestions utilisables
            return data
                .filter(result => result.lat && result.lon && result.display_name)
                .map(result => ({
                display_name: result.display_name,
                clean_address: this.buildCleanAddress(result),
                latitude: parseFloat(result.lat),
                longitude: parseFloat(result.lon)
            }));
        }
        catch (error) {
            console.error('Error in searchAddresses:', error);
            return [];
        }
    }
    //Construire une adresse propre et lisible
    static buildCleanAddress(result) {
        const address = result.address;
        const addressParts = [];
        // 1. Numéro + rue
        if (address?.house_number && address?.road) {
            addressParts.push(`${address.house_number} ${address.road}`);
        }
        else if (address?.road) {
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
exports.default = AddressService;
//# sourceMappingURL=addressService.js.map