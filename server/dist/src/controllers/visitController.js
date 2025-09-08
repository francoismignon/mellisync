"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const visitService_1 = __importDefault(require("../services/visitService"));
const actionService_1 = __importDefault(require("../services/actionService"));
const hiveService_1 = __importDefault(require("../services/hiveService"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const react_1 = __importDefault(require("react"));
const server_1 = require("react-dom/server");
const VisitPDFTemplate_1 = __importDefault(require("../components/VisitPDFTemplate"));
class VisitController {
    static async create(req, res) {
        try {
            //Récupération body
            const { hiveId, visitActions } = req.body;
            //Validation basique
            if (!hiveId || !visitActions || typeof visitActions !== 'object') {
                return res.status(400).json({
                    error: "hiveId et visitActions sont requis"
                });
            }
            //Récupération du rucher pour la météo
            const hive = await hiveService_1.default.findById(hiveId);
            if (!hive || !hive.apiary_hives?.[0]?.apiary) {
                return res.status(404).json({
                    error: "Ruche ou rucher non trouvé"
                });
            }
            const apiaryId = hive.apiary_hives[0].apiary.id;
            //Récupération météo temps réel au moment de la visite
            const weatherData = await actionService_1.default.getCurrentWeather(apiaryId);
            //Appel service avec données validées + météo
            const visit = await visitService_1.default.create({
                hiveId,
                visitActions,
                temperature: weatherData.temperature,
                weather: weatherData.condition
            });
            res.status(201).json(visit);
        }
        catch (error) {
            console.error("Erreur création visite:", error);
            res.status(500).json({
                error: "Erreur serveur lors de la création de la visite"
            });
        }
    }
    static async findAllByHive(req, res) {
        try {
            const id = parseInt(req.params.id);
            const visits = await visitService_1.default.findAllByHive(id);
            res.status(200).json(visits);
        }
        catch (error) {
            console.error("Erreur récupération visites:", error);
            res.status(500).json();
        }
    }
    //Génération PDF fiche de visite
    static async generatePDF(req, res) {
        try {
            const visitId = parseInt(req.params.id);
            //Récupération données visite complètes
            const visit = await visitService_1.default.findById(visitId);
            if (!visit) {
                return res.status(404).json({ error: "Visite non trouvée" });
            }
            //Calcul numéro de visite pour cette ruche spécifique
            const allVisitsForHive = await visitService_1.default.findAllByHive(visit.hiveId);
            //Trier par date pour avoir la bonne position chronologique
            const sortedVisits = allVisitsForHive.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            const visitNumber = sortedVisits.findIndex(v => v.id === visitId) + 1;
            //Utilisation météo historique stockée dans la visite
            const contextData = {
                weather: {
                    temperature: visit.temperature || 0,
                    condition: visit.weather || "Non disponible"
                },
                period: actionService_1.default.getCurrentPeriod() // Période selon date visite
            };
            //Génération HTML depuis composant React
            const htmlContent = (0, server_1.renderToStaticMarkup)(react_1.default.createElement(VisitPDFTemplate_1.default, {
                visit: {
                    ...visit,
                    visitNumber,
                    date: visit.date.toISOString(), // Date complète ISO pour garder l'heure
                    visitActions: visit.visitActions.map(va => ({
                        id: va.id,
                        value: va.value,
                        action: {
                            id: va.action.id,
                            label: va.action.label,
                            actionType: va.action.actionType
                        }
                    }))
                },
                weather: contextData.weather,
                period: contextData.period
            }));
            //Lancement Puppeteer pour génération PDF
            const browser = await puppeteer_1.default.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage'
                ]
            });
            const page = await browser.newPage();
            //Configuration format A4
            await page.setContent(`<!DOCTYPE html>${htmlContent}`, {
                waitUntil: 'networkidle0'
            });
            //Génération PDF avec options
            const pdfBuffer = await page.pdf({
                format: 'A4',
                margin: {
                    top: '20mm',
                    right: '15mm',
                    bottom: '20mm',
                    left: '15mm'
                },
                printBackground: true
            });
            await browser.close();
            //Envoi PDF au client
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="fiche-visite-${visitId}.pdf"`);
            res.send(pdfBuffer);
        }
        catch (error) {
            console.error("Erreur génération PDF:", error);
            res.status(500).json({
                error: "Erreur lors de la génération du PDF"
            });
        }
    }
}
exports.default = VisitController;
//# sourceMappingURL=visitController.js.map