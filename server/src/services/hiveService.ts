import prisma from "../lib/prisma";

class HiveService {

  static async findById(id: number){
    return await prisma.hive.findUnique({
      where: {id:id}
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
}
export default HiveService;
