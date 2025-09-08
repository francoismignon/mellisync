import prisma from "../lib/prisma";
import QRCode from 'qrcode';

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
    return await prisma.$transaction(async (tx) => {
      // 1. Créer d'abord la ruche
      const hive = await tx.hive.create({
        data: hiveData,
      });

      // 2. Créer la relation apiary-hive
      await tx.apiaryHive.create({
        data: {
          hiveId: hive.id,
          apiaryId,
        },
      });

      // 3. Générer le QR code avec l'URL vers la ruche
      try {
        const hiveUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/ruchers/${apiaryId}/ruches/${hive.id}`;
        const qrCodeDataUrl = await QRCode.toDataURL(hiveUrl, {
          errorCorrectionLevel: 'M',
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        // 4. Mettre à jour la ruche avec le QR code
        const updatedHive = await tx.hive.update({
          where: { id: hive.id },
          data: { qrCodeDataUrl },
        });

        return updatedHive;
      } catch (qrError) {
        console.error('Erreur génération QR code:', qrError);
        // Retourner la ruche sans QR code plutôt que de faire échouer la création
        return hive;
      }
    });
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

  // Générer/Régénérer QR code pour toute ruche
  static async generateQRCode(hiveId: number) {
    try {
      // Récupérer la ruche avec son rucher actuel
      const hive = await prisma.hive.findUnique({
        where: { id: hiveId },
        include: {
          apiary_hives: {
            where: { endDate: null },
            include: { apiary: true }
          }
        }
      });

      if (!hive || !hive.apiary_hives[0]) {
        throw new Error('Ruche ou rucher introuvable');
      }

      const apiaryId = hive.apiary_hives[0].apiary.id;
      const hiveUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/ruchers/${apiaryId}/ruches/${hive.id}`;
      
      const qrCodeDataUrl = await QRCode.toDataURL(hiveUrl, {
        errorCorrectionLevel: 'M',
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Mettre à jour la ruche avec le QR code
      const updatedHive = await prisma.hive.update({
        where: { id: hiveId },
        data: { qrCodeDataUrl },
        include: {
          apiary_hives: {
            where: { endDate: null },
            include: { apiary: true }
          }
        }
      });

      return updatedHive;
    } catch (error) {
      console.error("Erreur génération QR code:", error);
      throw error;
    }
  }
}
export default HiveService;
