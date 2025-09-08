import VisitRepository from "../repositories/visitRepository";

//Interface TypeScript pour les données de création visite
interface CreateVisitData {
  hiveId: number;
  visitActions: {
    [actionId: string]: string | number;  // Clé = ID action, Valeur = résultat
  };
  temperature?: number;  // Température au moment de la visite
  weather?: string;      // Condition météo au moment de la visite
}

class VisitService {
  //Méthode principale : Créer visite + toutes ses actions
  static async create(data: CreateVisitData) {
    const { hiveId, visitActions, temperature, weather } = data;
    
    // Préparer données visite
    const visitData = {
      hiveId,
      date: new Date(),
      temperature: temperature || undefined,
      weather: weather || undefined
    };

    // Préparer actions formatées
    const formattedActions = Object.entries(visitActions).map(([actionId, value]) => ({
      actionId: parseInt(actionId),
      value: String(value)
    }));

    return await VisitRepository.createWithActions(visitData, formattedActions);
  }

  //Méthode future : Récupérer toutes les visites d'une ruche
  static async findByHiveId(hiveId: number) {
    return await VisitRepository.findAllByHive(hiveId);
  }

  //Méthode future : Récupérer une visite spécifique
  static async findById(id: number) {
    return await VisitRepository.findById(id);
  }

  static async findAllByHive(hiveId: number) {
    return await VisitRepository.findAllByHive(hiveId);
  }
}

export default VisitService;