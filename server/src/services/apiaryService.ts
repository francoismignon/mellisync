import prisma from "../lib/prisma";

class ApiaryService{
    static async create(name: string, address: string, city: string, userId: number){
        return await prisma.apiary.create({
            data: {
                name,
                address,
                city,
                userId
            }
        });
    }

    //TODO: adapter lors d' l'authentification
    static async findAll(){
        return await prisma.apiary.findMany();
    }

    static async delete(id: number){
        return await prisma.apiary.delete({
            where: {id}
        });
    }

}
export default ApiaryService;