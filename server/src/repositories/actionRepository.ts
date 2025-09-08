import prisma from "../lib/prisma";

class ActionRepository {

  static async findAllWithRelations() {
    return await prisma.action.findMany({
      include: {
        action_options: {
          include: { option: true }
        },
        action_periods: {
          include: { period: true }
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
        action_periods: {
          include: { period: true }
        },
        action_weather_restrictions: {
          include: { weatherRestriction: true }
        }
      }
    });
  }

  static async findAllPeriods() {
    return await prisma.period.findMany({
      orderBy: { startMonth: 'asc' }
    });
  }

  static async findAllWeatherRestrictions() {
    return await prisma.weatherRestriction.findMany();
  }

  static async findPeriodByKey(key: string) {
    return await prisma.period.findUnique({
      where: { key }
    });
  }

  static async findWeatherRestrictionByCondition(condition: string) {
    return await prisma.weatherRestriction.findFirst({
      where: { condition: { contains: condition, mode: 'insensitive' } }
    });
  }
}

export default ActionRepository;