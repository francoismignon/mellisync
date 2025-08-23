import prisma from "../lib/prisma";

//Interface TypeScript pour les données de création visite
interface CreateVisitData {
  hiveId: number;
  visitActions: {
    [actionId: string]: string | number;  // Clé = ID action, Valeur = résultat
  };
}

class VisitService {
  //Méthode principale : Créer visite + toutes ses actions
  static async create(data: CreateVisitData) {
    const { hiveId, visitActions } = data;

    //Transaction Prisma : Tout ou rien (atomicité garantie)
    return await prisma.$transaction(async (tx) => {
      
      //ÉTAPE 1 : Créer la visite
      const visit = await tx.visit.create({
        data: {
          hiveId: hiveId,
          date: new Date(),  // Date/heure actuelle automatique
        },
      });

      //ÉTAPE 2 : Préparer les actions pour création en lot
      const visitActionsToCreate = Object.entries(visitActions).map(([actionId, value]) => ({
        visitId: visit.id,           // FK vers visite créée
        actionId: parseInt(actionId), // ID action (string → number)
        value: String(value),        // Valeur action (number|string → string)
      }));

      //ÉTAPE 3 : Créer toutes les VisitAction en une fois (performance)
      await tx.visitAction.createMany({
        data: visitActionsToCreate,
      });

      //ÉTAPE 4 : Retourner visite complète avec actions pour confirmation
      const visitWithActions = await tx.visit.findUnique({
        where: { id: visit.id },
        include: {
          visitActions: {
            include: {
              action: true,  // Inclut détails action pour debugging/confirmation
            },
          },
          hive: {
            select: { id: true, name: true }  // Infos ruche pour confirmation
          }
        },
      });

      return visitWithActions;
    });
  }

  //Méthode future : Récupérer toutes les visites d'une ruche
  static async findByHiveId(hiveId: number) {
    return await prisma.visit.findMany({
      where: { hiveId },
      include: {
        visitActions: {
          include: { action: true }
        }
      },
      orderBy: { date: 'desc' }  // Plus récentes en premier
    });
  }

  //Méthode future : Récupérer une visite spécifique
  static async findById(id: number) {
    return await prisma.visit.findUnique({
      where: { id },
      include: {
        visitActions: {
          include: { action: true }
        },
        hive: {
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
        }
      }
    });
  }

  static async findAllByHive(hiveId: number) {
    return await prisma.visit.findMany({
      where: { hiveId },
      include: {
        visitActions: {
          include: { action: true }
        }
      },
      orderBy: { date: 'desc' }  // Plus récentes en premier
    });
  }
}

export default VisitService;