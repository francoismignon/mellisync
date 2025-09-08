import prisma from "../lib/prisma";

class UserRepository {

  static async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: { role: true }
    });
  }

  static async findById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
      include: { role: true }
    });
  }

  static async create(data: { name: string; email: string; hashedPassword: string; roleId: number }) {
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.hashedPassword,
        roleId: data.roleId
      },
      include: { role: true }
    });
  }

  static async findDefaultBeekeeperRole() {
    return await prisma.role.findUnique({
      where: { name: "BEEKEEPER" }
    });
  }
}

export default UserRepository;