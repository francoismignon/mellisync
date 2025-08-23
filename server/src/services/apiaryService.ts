import prisma from "../lib/prisma";
import WeatherService from "./weatherService";

class ApiaryService {
    
  static async findById(id: number) {
    return await prisma.apiary.findUnique({
      where: { id: id },
    });
  }

  static async create(
    name: string,
    address: string,
    city: string,
    userId: number
  ) {
    // 📍 Géocodage automatique de l'adresse lors de la création
    const coordinates = await WeatherService.geocodeAddress(address, city);
    
    return await prisma.apiary.create({
      data: {
        name,
        address,
        city,
        latitude: coordinates?.latitude || null,
        longitude: coordinates?.longitude || null,
        userId,
      },
    });
  }

  static async findAll() {
    return await prisma.apiary.findMany();
  }

  /**
   * Récupérer tous les ruchers d'un utilisateur (RBAC)
   */
  static async findAllByUser(userId: number) {
    return await prisma.apiary.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}
export default ApiaryService;
