import prisma from "../lib/prisma";

class ActionRepository {

  static async findAllWithRelations() {
    return await prisma.action.findMany({
      include: {
        action_options: {
          include: { option: true }
        },
        action_periodes: {
          include: { periode: true }
        },
        action_weather_restrictions: {
          include: { weatherRestriction: true }
        }
      },
      orderBy: { id: 'asc' }
    });
  }

  static async findById(id: number) {
    return await prisma.action.findUnique({
      where: { id },
      include: {
        action_options: {
          include: { option: true }
        },
        action_periodes: {
          include: { periode: true }
        },
        action_weather_restrictions: {
          include: { weatherRestriction: true }
        }
      }
    });
  }

  static async findAllPeriods() {
    return await prisma.periode.findMany({
      orderBy: { id: 'asc' }
    });
  }

  static async findAllWeatherRestrictions() {
    return await prisma.weatherRestriction.findMany();
  }

  static async findPeriodByLabel(label: string) {
    return await prisma.periode.findFirst({
      where: { label }
    });
  }

  static async findWeatherRestrictionByCondition(condition: string) {
    return await prisma.weatherRestriction.findFirst({
      where: { label: { contains: condition, mode: 'insensitive' } }
    });
  }
}

export default ActionRepository;