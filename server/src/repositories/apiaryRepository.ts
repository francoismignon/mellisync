import prisma from "../lib/prisma";

class ApiaryRepository {

  static async findAllByUser(userId: number) {
    return await prisma.apiary.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            apiary_hives: {
              where: { endDate: null } // Ruches actuellement dans ce rucher
            }
          }
        },
        apiary_hives: {
          where: { endDate: null },
          include: {
            hive: {
              select: { status: true }
            }
          }
        }
      }
    });
  }

  static async findById(id: number) {
    return await prisma.apiary.findUnique({
      where: { id }
    });
  }

  static async findByIdForUser(id: number, userId: number) {
    return await prisma.apiary.findFirst({
      where: { 
        id,
        userId 
      }
    });
  }

  static async create(data: { 
    name: string; 
    address: string; 
    userId: number;
    latitude?: number | null;
    longitude?: number | null;
  }) {
    return await prisma.apiary.create({
      data
    });
  }

  static async update(id: number, data: { 
    latitude?: number; 
    longitude?: number; 
  }) {
    return await prisma.apiary.update({
      where: { id },
      data
    });
  }

  static async delete(id: number) {
    return await prisma.apiary.delete({
      where: { id }
    });
  }
}

export default ApiaryRepository;