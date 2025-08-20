import prisma from "../lib/prisma";

class ActionService {
  static async findAll() {
    return await prisma.action.findMany({
      include: {
        action_options: {
          include: {
            option: true,
          },
        },
        action_periodes: {
          include: {
            periode: true,
          },
        },
        action_weather_restrictions: {
          include: {
            weatherRestriction: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });
  }
}
export default ActionService;
