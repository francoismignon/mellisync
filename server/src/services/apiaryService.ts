import prisma from "../lib/prisma";

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
    return await prisma.apiary.create({
      data: {
        name,
        address,
        city,
        userId,
      },
    });
  }

  //TODO: adapter lors d' l'authentification
  static async findAll() {
    return await prisma.apiary.findMany();
  }

  static async delete(id: number) {
    return await prisma.apiary.delete({
      where: { id: id },
    });
  }
}
export default ApiaryService;
