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
          include: { weatherCondition: true }
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
          include: { weatherCondition: true }
        }
      }
    });
  }

  static async findAllPeriods() {
    return await prisma.periode.findMany({
      orderBy: { id: 'asc' }
    });
  }

  static async findAllWeatherConditions() {
    return await prisma.weatherCondition.findMany();
  }

  static async findPeriodById(id: number) {
    return await prisma.periode.findUnique({
      where: { id }
    });
  }

  static async findWeatherConditionByWmoCode(wmoCode: number) {
    return await prisma.weatherCondition.findFirst({
      where: { wmo_code: wmoCode }
    });
  }
}

export default ActionRepository;