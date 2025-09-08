import ApiaryRepository from "../repositories/apiaryRepository";
import WeatherService from "./weatherService";

class ApiaryService {
    
  static async findById(id: number) {
    return await ApiaryRepository.findById(id);
  }

  static async create(
    name: string,
    address: string,
    city: string,
    userId: number
  ) {
    // Géocodage automatique de l'adresse lors de la création
    const coordinates = await WeatherService.geocodeAddress(address, city);
    
    return await ApiaryRepository.create({
      name,
      address,
      city,
      userId,
      latitude: coordinates?.latitude || null,
      longitude: coordinates?.longitude || null,
    });
  }

  /**
   * Récupérer tous les ruchers d'un utilisateur (RBAC)
   */
  static async findAllByUser(userId: number) {
    return await ApiaryRepository.findAllByUser(userId);
  }
}
export default ApiaryService;
