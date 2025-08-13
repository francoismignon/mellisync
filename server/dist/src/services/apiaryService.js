import prisma from "../lib/prisma";
class ApiaryService {
    static async create(name, address, city, userId) {
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
    static async findAll() {
        return await prisma.apiary.findMany();
    }
}
export default ApiaryService;
//# sourceMappingURL=apiaryService.js.map