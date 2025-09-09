//Service pour intégration API Open-Meteo (météo uniquement)

//Interface pour réponse météo
interface WeatherResponse {
  current?: {
    time: string;
    temperature_2m: number;
    weathercode: number;
  };
}

//Interface pour données météo
interface WeatherData {
  temperature: number;
  condition: string;
}

class WeatherService {
  
  //Récupération météo actuelle via Open-Meteo Weather API
  static async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData> {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode`;
      
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Weather API error: ${response.status}`);
        return this.getFallbackWeather();
      }
      
      const data: WeatherResponse = await response.json();
      
      if (!data.current) {
        console.warn('No current weather data in response');
        return this.getFallbackWeather();
      }
      
      return {
        temperature: Math.round(data.current.temperature_2m),
        condition: this.mapWeatherCode(data.current.weathercode)
      };
      
    } catch (error) {
      console.error('Error in getCurrentWeather:', error);
      return this.getFallbackWeather();
    }
  }
  
  //Mapping weathercode → conditions textuelles
  private static mapWeatherCode(code: number): string {
    // Codes Open-Meteo selon WMO (World Meteorological Organization)
    const weatherCodes: { [key: number]: string } = {
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
  private static getFallbackWeather(): WeatherData {
    return {
      temperature: -5,
      condition: "Neige légère"
    };
  }
}

export default WeatherService;