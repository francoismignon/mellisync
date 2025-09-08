"use strict";
//Service pour intégration APIs Open-Meteo (géocodage + météo)
Object.defineProperty(exports, "__esModule", { value: true });
class WeatherService {
    //Géocodage d'une ville via Open-Meteo Geocoding API
    static async geocodeAddress(_address, city) {
        try {
            //Utiliser uniquement la ville pour plus de fiabilité
            const query = encodeURIComponent(city);
            const url = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1&language=fr&format=json`;
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Geocoding API error: ${response.status}`);
                return null;
            }
            const data = await response.json();
            if (!data.results || data.results.length === 0) {
                console.warn(`No geocoding results for city: ${city}`);
                return null;
            }
            const result = data.results[0];
            return {
                latitude: result.latitude,
                longitude: result.longitude
            };
        }
        catch (error) {
            console.error('Error in geocodeAddress:', error);
            return null;
        }
    }
    //Récupération météo actuelle via Open-Meteo Weather API
    static async getCurrentWeather(latitude, longitude) {
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode`;
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Weather API error: ${response.status}`);
                return this.getFallbackWeather();
            }
            const data = await response.json();
            if (!data.current) {
                console.warn('No current weather data in response');
                return this.getFallbackWeather();
            }
            return {
                temperature: Math.round(data.current.temperature_2m),
                condition: this.mapWeatherCode(data.current.weathercode)
            };
        }
        catch (error) {
            console.error('Error in getCurrentWeather:', error);
            return this.getFallbackWeather();
        }
    }
    //Mapping weathercode → conditions textuelles
    static mapWeatherCode(code) {
        // Codes Open-Meteo selon WMO (World Meteorological Organization)
        const weatherCodes = {
            0: "Ciel dégagé",
            1: "Principalement dégagé",
            2: "Partiellement nuageux",
            3: "Couvert",
            45: "Brouillard",
            48: "Brouillard givrant",
            51: "Bruine légère",
            53: "Bruine modérée",
            55: "Bruine forte",
            61: "Pluie légère",
            63: "Pluie modérée",
            65: "Pluie forte",
            71: "Neige légère",
            73: "Neige modérée",
            75: "Neige forte",
            80: "Averses légères",
            81: "Averses modérées",
            82: "Averses fortes",
            95: "Orage"
        };
        return weatherCodes[code] || "Conditions inconnues";
    }
    //Données météo par défaut en cas d'erreur
    static getFallbackWeather() {
        return {
            temperature: -5,
            condition: "Neige légère"
        };
    }
}
exports.default = WeatherService;
//# sourceMappingURL=weatherService.js.map