import prisma from "../lib/prisma";

class HiveService{
    static async findAllByUser(userId: number){
        return await prisma.hive.findMany({
            where: {
                apiary_hives:{
                    some:{
                        apiary:{
                            userId: userId
                        }
                    }
                }
            }
        });
    }

}
export default HiveService;