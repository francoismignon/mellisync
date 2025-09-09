import HiveRepository from "../repositories/hiveRepository";
import ApiaryRepository from "../repositories/apiaryRepository";
import QRCode from 'qrcode';

class HiveService {

  static async findById(id: number){
    return await HiveRepository.findById(id);
  }

  static async findAllByApiary(apiaryId: number) {
    return await HiveRepository.findAllByApiary(apiaryId);
  }

  static async createByApiary(apiaryId: number, hiveData: any) {
    // 1. Créer la ruche avec transaction Repository
    const hive = await HiveRepository.createWithApiary(apiaryId, hiveData);

    // 2. Générer QR code si possible
    try {
      const hiveUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/ruchers/${apiaryId}/ruches/${hive.id}`;
      const qrCodeDataUrl = await QRCode.toDataURL(hiveUrl, {
        errorCorrectionLevel: 'M',
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // 3. Mettre à jour avec QR code
      return await HiveRepository.updateQRCode(hive.id, qrCodeDataUrl);

    } catch (qrError) {
      console.error('Erreur génération QR code:', qrError);
      // Retourner la ruche même si QR code échoue (fallback gracieux)
      return hive;
    }
  }

  static async getTranshumanceHistory(hiveId: number) {
    return await HiveRepository.getTranshumanceHistory(hiveId);
  }

  static async getVisitsHistory(hiveId: number) {
    return await HiveRepository.getVisitsHistory(hiveId);
  }

  static async generateQRCode(hiveId: number) {
    // 1. Récupérer la ruche pour obtenir l'apiaryId
    const hive = await HiveRepository.findById(hiveId);
    if (!hive || !hive.apiary_hives?.[0]) {
      throw new Error('Ruche non trouvée ou sans rucher associé');
    }

    const apiaryId = hive.apiary_hives[0].apiary.id;

    // 2. Générer QR code avec URL complète  
    const hiveUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/ruchers/${apiaryId}/ruches/${hive.id}`;
    const qrCodeDataUrl = await QRCode.toDataURL(hiveUrl, {
      errorCorrectionLevel: 'M',
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // 3. Sauvegarder et retourner
    return await HiveRepository.updateQRCode(hiveId, qrCodeDataUrl);
  }

  static async updateStatus(id: number, status: string, userId: number, reason?: string) {
    // Vérification RBAC : s'assurer que la ruche appartient à l'utilisateur
    const hive = await HiveRepository.findById(id);
    if (!hive || !hive.apiary_hives?.[0]) {
      throw new Error('Ruche non trouvée');
    }

    // Vérifier ownership via le rucher
    const apiary = await ApiaryRepository.findByIdForUser(hive.apiary_hives[0].apiary.id, userId);
    if (!apiary) {
      throw new Error('Accès non autorisé à cette ruche');
    }

    return await HiveRepository.updateStatus(id, status, reason);
  }

  static async moveHive(hiveId: number, newApiaryId: number, reason: string, userId: number, note?: string) {
    // Vérification RBAC : vérifier ownership des deux ruchers
    const hive = await HiveRepository.findById(hiveId);
    if (!hive || !hive.apiary_hives?.[0]) {
      throw new Error('Ruche non trouvée');
    }

    // Vérifier ownership rucher source
    const currentApiary = await ApiaryRepository.findByIdForUser(hive.apiary_hives[0].apiary.id, userId);
    if (!currentApiary) {
      throw new Error('Accès non autorisé à la ruche source');
    }

    // Vérifier ownership rucher destination
    const targetApiary = await ApiaryRepository.findByIdForUser(newApiaryId, userId);
    if (!targetApiary) {
      throw new Error('Accès non autorisé au rucher de destination');
    }

    return await HiveRepository.moveToApiary(hiveId, newApiaryId, reason, note);
  }

  static async findAllByUser(userId: number) {
    return await HiveRepository.findAllByUser(userId);
  }
}
export default HiveService;
