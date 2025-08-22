import prisma from "../lib/prisma";
import WeatherService from "./weatherService";

// 📋 Types TypeScript pour la structure des données
interface WeatherData {
  temperature: number;  // Température en °C
  condition: string;    // Condition météo mappée (ex: "Ensoleillé", "Pluie")
}

interface FilteredActionsResponse {
  currentPeriod: string;        // Période apicole calculée (ex: "traitement_été")
  currentTemperature: number;   // Température actuelle en °C  
  currentWeather: string;       // Condition météo actuelle
  actions: any[];              // Actions autorisées maintenant (pré-filtrées)
}

class ActionService {
  // 📚 SERVICE CLASSIQUE : Retourne TOUTES les actions (mode expert)
  static async findAll() {
    // Requête Prisma avec TOUTES les relations many-to-many
    return await prisma.action.findMany({
      include: {
        // Inclut les options de chaque action (Oui/Non, etc.)
        action_options: {
          include: { option: true },
        },
        // Inclut les périodes autorisées pour chaque action
        action_periodes: {
          include: { periode: true },
        },
        // Inclut les restrictions météo de chaque action  
        action_weather_restrictions: {
          include: { weatherRestriction: true },
        },
      },
      orderBy: { id: "asc" }, // Tri par ID croissant
    });
  }

  // 🧠 SERVICE INTELLIGENT : Filtrage selon règles métier apicoles
  static async findForVisit(apiaryId?: number): Promise<FilteredActionsResponse> {
    
    // 1️⃣ ÉTAPE DATA : Réutiliser findAll() pour éviter duplication code
    // ✅ DRY Principle : Don't Repeat Yourself
    const allActions = await this.findAll(); // Récupère toutes actions + relations (déjà optimisé)

    // 2️⃣ ÉTAPE CONTEXTE : Calculer situation actuelle apicole
    const currentPeriod = this.getCurrentPeriod();    // Période selon date (hiver, printemps...)
    const weatherData = await this.getCurrentWeather(apiaryId); // Température + météo spécifiques au rucher

    // 3️⃣ ÉTAPE FILTRAGE : Appliquer règles métier pour chaque action
    const filteredActions = this.filterActionsByRules(
      allActions,     // Toutes les actions de la DB
      currentPeriod,  // Ex: "traitement_été" 
      weatherData     // Ex: { temperature: 18, condition: "Ensoleillé" }
    );

    // 4️⃣ ÉTAPE RESPONSE : Structurer réponse avec contexte + actions filtrées
    return {
      currentPeriod,                           // Période calculée pour info frontend
      currentTemperature: weatherData.temperature, // Température pour info frontend  
      currentWeather: weatherData.condition,       // Météo pour info frontend
      actions: filteredActions                     // SEULEMENT les actions autorisées maintenant
    };
  }

  // 📅 MÉTHODE 1: Calcul période apicole selon date actuelle (retourne label utilisateur)
  static getCurrentPeriod(): string {
    const now = new Date();
    const month = now.getMonth() + 1; // JavaScript months: 0-indexed → +1 pour mois réel
    const day = now.getDate();

    // 🏔️ Périodes selon Guide officiel apicole Wallonie (8 périodes annuelles)
    if (month === 1 || (month === 2 && day <= 15)) {
      return "hiver";                    // Jan - 15 fév : Repos hivernal, minimal interventions
    }
    if ((month === 2 && day > 15) || month === 3) {
      return "fin_hiver";               // 16 fév - Mars : Préparation réveil, premiers contrôles  
    }
    if (month >= 4 && month <= 6) {
      return "miellée_primptemps";         // Avr-Juin : Période productive, surveillance reine/couvain
    }
    if (month === 7) {
      return "inter_miellée";                // Juillet : Entre 2 miellées, récolte miel
    }
    if ((month === 8 && day <= 15)) {
      return "pré_traitement";               // 1-15 août : Préparation traitements varroa
    }
    if ((month === 8 && day > 15) || month === 9) {
      return "traitement_été";             // 16 août-Sept : Traitement varroa obligatoire
    }
    if (month >= 10 && month <= 11) {
      return "préparation_hiver";        // Oct-Nov : Préparation hivernage, nourrissement
    }
    if (month === 12) {
      return "traitement_hiver";          // Décembre : Traitement hiver (acide oxalique)
    }
    
    return "hiver"; // Fallback sécurité
  }

  // 🌤️ MÉTHODE 2: Récupération météo actuelle avec API Open-Meteo
  static async getCurrentWeather(apiaryId?: number): Promise<WeatherData> {
    // Si aucun apiaryId fourni, utiliser coordonnées par défaut (Bruxelles)
    let latitude = 50.8503; // Bruxelles par défaut
    let longitude = 4.3517;
    
    // 📍 Si apiaryId fourni, récupérer les coordonnées du rucher
    if (apiaryId) {
      try {
        const apiary = await prisma.apiary.findUnique({
          where: { id: apiaryId },
          select: { latitude: true, longitude: true }
        });
        
        if (apiary?.latitude && apiary?.longitude) {
          latitude = parseFloat(apiary.latitude.toString());
          longitude = parseFloat(apiary.longitude.toString());
        }
      } catch (error) {
        console.warn(`Erreur récupération coordonnées rucher ${apiaryId}:`, error);
      }
    }
    
    // 🌤️ Appel API météo avec coordonnées
    return await WeatherService.getCurrentWeather(latitude, longitude);
  }

  // 🎯 MÉTHODE 3: Filtrage actions selon 4 règles métier apicoles
  static filterActionsByRules(actions: any[], currentPeriod: string, weather: WeatherData): any[] {
    return actions.filter(action => {
      
      // 🗓️ FILTRE 1: Vérification période saisonnière
      if (action.action_periodes.length > 0) {
        // Extrait les périodes autorisées pour cette action (ex: ["miellée_printemps", "traitement_été"])
        const allowedPeriods = action.action_periodes.map((ap: any) => ap.periode.label);
        if (!allowedPeriods.includes(currentPeriod)) {
          return false; // ❌ Action interdite pour période actuelle (ex: traitement hiver en été)
        }
      }
      // Si action.action_periodes vide = action autorisée toute l'année

      // 🌡️ FILTRE 2: Vérification température minimum
      if (action.temperatureMin !== null && weather.temperature < action.temperatureMin) {
        return false; // ❌ Trop froid (ex: inspection couvain si < 15°C)
      }

      // 🔥 FILTRE 3: Vérification température maximum  
      if (action.temperatureMax !== null && weather.temperature > action.temperatureMax) {
        return false; // ❌ Trop chaud (ex: traitement acide oxalique si > 8°C)
      }

      // ☔ FILTRE 4: Vérification restrictions météorologiques
      if (action.action_weather_restrictions.length > 0) {
        // Extrait restrictions météo pour cette action (ex: ["Pluie", "Vent fort"])
        const weatherRestrictions = action.action_weather_restrictions.map((wr: any) => wr.weatherRestriction.label);
        if (weatherRestrictions.includes(weather.condition)) {
          return false; // ❌ Météo défavorable (ex: ouverture ruche sous la pluie)
        }
      }

      return true; // ✅ Action autorisée ! Toutes les conditions respectées
    });
  }
}
export default ActionService;
