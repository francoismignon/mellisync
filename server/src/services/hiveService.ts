import prisma from "../lib/prisma";

class HiveService {

  static async findById(id: number){
    return await prisma.hive.findUnique({
      where: {id:id},
      include: {
        apiary_hives: {
          where: { endDate: null }, // Rucher actuel
          include: {
            apiary: {
              select: { id: true, name: true, address: true, city: true }
            }
          }
        }
      }
    });
  }


  static async findAllByApiary(apiaryId: number) {
    return await prisma.hive.findMany({
      where: {
        apiary_hives: {
          some: {
            apiaryId: apiaryId,
            endDate: null, // ruches actuellement dans ce rucher
          },
        },
      },
    });
  }

  static async createByApiary(apiaryId: number, hiveData: any) {
    //on cree d'abord la ruche
    const hive = await prisma.hive.create({
      data: hiveData,
    });

    //on cree ensuite la relatioin
    await prisma.apiaryHive.create({
      data: {
        hiveId: hive.id,
        apiaryId,
      },
    });

    return hive;
  }

  //Méthode pour récupérer l'historique des transhumances d'une ruche
  static async getTranshumanceHistory(hiveId: number) {
    return await prisma.apiaryHive.findMany({
      where: { hiveId: hiveId },
      include: {
        apiary: {
          select: { id: true, name: true, address: true, city: true }
        }
      },
      orderBy: { startDate: 'desc' }  // Plus récentes en premier
    });
  }

  //Méthode pour déplacer une ruche vers un autre rucher
  static async moveToApiary(hiveId: number, newApiaryId: number, reason: string, note?: string) {
    return await prisma.$transaction(async (tx) => {
      // 1. Fermer la transhumance actuelle (endDate = maintenant)
      await tx.apiaryHive.updateMany({
        where: { 
          hiveId: hiveId,
          endDate: null  // Relation active actuelle
        },
        data: { 
          endDate: new Date() 
        }
      });

      // 2. Créer la nouvelle relation
      const newTranshumance = await tx.apiaryHive.create({
        data: {
          hiveId: hiveId,
          apiaryId: newApiaryId,
          reason: reason as any, // Cast vers enum TranshumanceReason
          note: note || null,
          startDate: new Date(),
          endDate: null  // Relation active
        },
        include: {
          apiary: {
            select: { id: true, name: true, address: true, city: true }
          }
        }
      });

      return newTranshumance;
    });
  }

  // Modifier le statut d'une ruche
  static async updateStatus(hiveId: number, newStatus: string, note?: string) {
    try {
      // Mettre à jour le statut de la ruche
      const updatedHive = await prisma.hive.update({
        where: { id: hiveId },
        data: { 
          status: newStatus as any, // Cast en HiveStatus enum
          updatedAt: new Date()
        },
        include: {
          apiary_hives: {
            where: { endDate: null },
            include: { apiary: true }
          }
        }
      });

      return updatedHive;
    } catch (error) {
      console.error("Erreur modification statut ruche:", error);
      throw error;
    }
  }
}
export default HiveService;
