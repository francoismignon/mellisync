import prisma from "../lib/prisma";

class VisitRepository {

  static async findById(id: number) {
    return await prisma.visit.findUnique({
      where: { id },
      include: {
        hive: {
          include: {
            apiary_hives: {
              where: { endDate: null },
              include: {
                apiary: {
                  select: { id: true, name: true, address: true, city: true }
                }
              }
            }
          }
        },
        visitActions: {
          include: {
            action: {
              select: { id: true, label: true, actionType: true }
            }
          }
        }
      }
    });
  }

  static async createWithActions(visitData: {
    hiveId: number;
    date: Date;
    temperature?: number;
    weather?: string;
  }, visitActions: Array<{ actionId: number; value: string; }>) {
    return await prisma.$transaction(async (tx) => {
      // 1. Créer la visite
      const visit = await tx.visit.create({
        data: visitData,
      });

      // 2. Créer toutes les actions de visite
      if (visitActions.length > 0) {
        await tx.visitAction.createMany({
          data: visitActions.map((va) => ({
            visitId: visit.id,
            actionId: va.actionId,
            value: va.value,
          })),
        });
      }

      // 3. Retourner la visite avec ses relations
      return await tx.visit.findUnique({
        where: { id: visit.id },
        include: {
          visitActions: {
            include: {
              action: {
                select: { id: true, label: true, actionType: true }
              }
            }
          }
        }
      });
    });
  }

  static async findAllByHive(hiveId: number) {
    return await prisma.visit.findMany({
      where: { hiveId },
      include: {
        visitActions: {
          include: {
            action: {
              select: { id: true, label: true, actionType: true }
            }
          }
        }
      },
      orderBy: { date: 'desc' }
    });
  }

  static async findAllByUser(userId: number) {
    return await prisma.visit.findMany({
      where: {
        hive: {
          apiary_hives: {
            some: {
              apiary: {
                userId: userId
              },
              endDate: null
            }
          }
        }
      },
      include: {
        hive: {
          select: { id: true, name: true }
        },
        visitActions: {
          include: {
            action: {
              select: { id: true, label: true }
            }
          }
        }
      },
      orderBy: { date: 'desc' }
    });
  }

  static async getVisitNumberForHive(hiveId: number, visitId: number) {
    const allVisitsForHive = await prisma.visit.findMany({
      where: { hiveId },
      select: { id: true },
      orderBy: { date: 'asc' }
    });
    
    return allVisitsForHive.findIndex(v => v.id === visitId) + 1;
  }
}

export default VisitRepository;