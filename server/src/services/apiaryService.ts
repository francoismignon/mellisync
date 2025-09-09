import ApiaryRepository from "../repositories/apiaryRepository";
import WeatherService from "./weatherService";

class ApiaryService {
    
  static async findById(id: number) {
    return await ApiaryRepository.findById(id);
  }

  /**
   * Récupérer un rucher avec la météo locale (RBAC)
   */
  static async findByIdWithWeather(id: number, userId: number) {
    const apiary = await ApiaryRepository.findByIdForUser(id, userId);
    
    if (!apiary) {
      return null;
    }

    // Récupérer la météo si les coordonnées sont disponibles
    let weather = null;
    if (apiary.latitude && apiary.longitude) {
      try {
        weather = await WeatherService.getCurrentWeather(
          Number(apiary.latitude), 
          Number(apiary.longitude)
        );
      } catch (error) {
        console.error('Erreur récupération météo:', error);
        // On continue sans météo si l'API échoue
      }
    }

    return {
      ...apiary,
      weather
    };
  }

  static async create(
    name: string,
    address: string,
    latitude: number,
    longitude: number,
    userId: number
  ) {
    return await ApiaryRepository.create({
      name,
      address,
      city: '', // Plus utilisé, on garde le display_name complet dans address
      userId,
      latitude,
      longitude,
    });
  }

  /**
   * Récupérer tous les ruchers d'un utilisateur avec statistiques des ruches (RBAC)
   */
  static async findAllByUser(userId: number) {
    const apiaries = await ApiaryRepository.findAllByUser(userId);
    
    // Enrichir avec les statistiques des ruches
    return apiaries.map(apiary => {
      const totalHives = apiary._count.apiary_hives;
      const hiveStatuses = apiary.apiary_hives.map(ah => ah.hive.status);
      
      const activeHives = hiveStatuses.filter(status => status === 'ACTIVE').length;
      const inactiveHives = hiveStatuses.filter(status => status === 'INACTIVE').length;
      
      return {
        id: apiary.id,
        name: apiary.name,
        address: apiary.address,
        city: apiary.city,
        latitude: apiary.latitude,
        longitude: apiary.longitude,
        createdAt: apiary.createdAt,
        updatedAt: apiary.updatedAt,
        userId: apiary.userId,
        hiveStats: {
          total: totalHives,
          active: activeHives,
          inactive: inactiveHives
        }
      };
    });
  }
}
export default ApiaryService;
