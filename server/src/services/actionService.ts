import ActionRepository from "../repositories/actionRepository";
import ApiaryRepository from "../repositories/apiaryRepository";
import WeatherService from "./weatherService";

//Types TypeScript pour la structure des données
interface WeatherData {
  temperature: number;  // Température en °C
  condition: string;    // Condition météo mappée (ex: "Ensoleillé", "Pluie")
  wmoCode: number;      // Code WMO standardisé pour filtrage actions
}

interface FilteredActionsResponse {
  currentPeriod: string;        // Période apicole calculée (ex: "traitement_été")
  currentTemperature: number;   // Température actuelle en °C  
  currentWeather: string;       // Condition météo actuelle
  actions: any[];              // Actions autorisées maintenant (pré-filtrées)
}

class ActionService {
  //SERVICE CLASSIQUE : Retourne TOUTES les actions (mode expert)
  static async findAll() {
    return await ActionRepository.findAllWithRelations();
  }

  //SERVICE INTELLIGENT : Filtrage selon règles métier apicoles
  static async findForVisit(apiaryId?: number): Promise<FilteredActionsResponse> {
    
    // 1️ ÉTAPE DATA : Réutiliser findAll() pour éviter duplication code
    //DRY Principle : Don't Repeat Yourself
    const allActions = await this.findAll(); // Récupère toutes actions + relations (déjà optimisé)

    // 2️ ÉTAPE CONTEXTE : Calculer situation actuelle apicole
    const currentPeriodId = this.getCurrentPeriod();    // ID période selon date (1-8)
    const currentPeriodData = await ActionRepository.findPeriodById(currentPeriodId); // Récupère label depuis DB
    const weatherData = await this.getCurrentWeather(apiaryId); // Température + météo spécifiques au rucher

    // 3️ ÉTAPE FILTRAGE : Appliquer règles métier pour chaque action
    const filteredActions = this.filterActionsByRules(
      allActions,     // Toutes les actions de la DB
      currentPeriodId,  // ID période (1-8)
      weatherData     // Ex: { temperature: 18, condition: "Ensoleillé" }
    );

    // 4️ ÉTAPE RESPONSE : Structurer réponse avec contexte + actions filtrées
    return {
      currentPeriod: currentPeriodData?.label_fr || "Période inconnue", // Libellé français depuis DB
      currentTemperature: weatherData.temperature, // Température pour info frontend  
      currentWeather: weatherData.condition,       // Météo pour info frontend
      actions: filteredActions                     // SEULEMENT les actions autorisées maintenant
    };
  }

  //MÉTHODE 1: Calcul période apicole selon date actuelle (retourne ID période 1-8)
  static getCurrentPeriod(): number {
    const now = new Date();
    const month = now.getMonth() + 1; // JavaScript months: 0-indexed → +1 pour mois réel
    const day = now.getDate();

    //Périodes selon Guide officiel apicole Wallonie (8 périodes annuelles)
    if (month === 1 || (month === 2 && day <= 15)) {
      return 1;                    // Jan - 15 fév : Hiver
    }
    if ((month === 2 && day > 15) || month === 3) {
      return 2;                    // 16 fév - Mars : Fin d'hiver
    }
    if (month >= 4 && month <= 6) {
      return 3;                    // Avr-Juin : Miellée de printemps
    }
    if (month === 7) {
      return 4;                    // Juillet : Inter-miellée
    }
    if ((month === 8 && day <= 15)) {
      return 5;                    // 1-15 août : Pré-traitement
    }
    if ((month === 8 && day > 15) || month === 9) {
      return 6;                    // 16 août-Sept : Traitement d'été
    }
    if (month >= 10 && month <= 11) {
      return 7;                    // Oct-Nov : Préparation d'hiver
    }
    if (month === 12) {
      return 8;                    // Décembre : Traitement d'hiver
    }
    
    return 1; // Fallback sécurité → Hiver
  }

  //MÉTHODE HELPER: Récupération libellé français d'une période par son ID
  static async getPeriodLabelById(id: number): Promise<string> {
    const periodData = await ActionRepository.findPeriodById(id);
    return periodData?.label_fr || "Période inconnue";
  }

  //MÉTHODE 2: Récupération météo actuelle avec API Open-Meteo
  static async getCurrentWeather(apiaryId?: number): Promise<WeatherData> {
    // Si aucun apiaryId fourni, utiliser coordonnées par défaut (Bruxelles)
    let latitude = 50.8503; // Bruxelles par défaut
    let longitude = 4.3517;
    
    //Si apiaryId fourni, récupérer les coordonnées du rucher
    if (apiaryId) {
      try {
        const apiary = await ApiaryRepository.findById(apiaryId);
        
        if (apiary?.latitude && apiary?.longitude) {
          latitude = parseFloat(apiary.latitude.toString());
          longitude = parseFloat(apiary.longitude.toString());
        }
      } catch (error) {
        console.warn(`Erreur récupération coordonnées rucher ${apiaryId}:`, error);
      }
    }
    
    //Appel API météo avec coordonnées
    return await WeatherService.getCurrentWeather(latitude, longitude);
  }

  //MÉTHODE 3: Filtrage actions selon 4 règles métier apicoles
  static filterActionsByRules(actions: any[], currentPeriodId: number, weather: WeatherData): any[] {
    return actions.filter(action => {
      
      //FILTRE 1: Vérification période saisonnière
      if (action.action_periodes.length > 0) {
        // Extrait les IDs périodes autorisées pour cette action (ex: [3, 6] pour printemps et été)
        const allowedPeriodIds = action.action_periodes.map((ap: any) => ap.periodeId);
        if (!allowedPeriodIds.includes(currentPeriodId)) {
          return false; //Action interdite pour période actuelle (ex: ID 8=traitement hiver en ID 6=été)
        }
      }
      // Si action.action_periodes vide = action autorisée toute l'année

      //FILTRE 2: Vérification température minimum
      if (action.temperatureMin !== null && weather.temperature < action.temperatureMin) {
        return false; //Trop froid (ex: inspection couvain si < 15°C)
      }

      //FILTRE 3: Vérification température maximum  
      if (action.temperatureMax !== null && weather.temperature > action.temperatureMax) {
        return false; //Trop chaud (ex: traitement acide oxalique si > 8°C)
      }

      //FILTRE 4: Vérification restrictions météorologiques (codes WMO standardisés)
      if (action.action_weather_restrictions.length > 0) {
        // Extrait codes WMO interdits pour cette action (ex: [61, 63, 65, 95] pour pluie/orage)
        const restrictedWmoCodes = action.action_weather_restrictions.map((wr: any) => wr.weatherCondition.wmo_code);
        if (restrictedWmoCodes.includes(weather.wmoCode)) {
          return false; //Météo défavorable selon code WMO (ex: ouverture ruche code 61=pluie légère)
        }
      }

      return true; //Action autorisée ! Toutes les conditions respectées
    });
  }
}
export default ActionService;
