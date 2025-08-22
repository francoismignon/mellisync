import { Request, Response } from 'express';
import VisitService from "../services/visitService";
import ActionService from "../services/actionService";
import puppeteer from 'puppeteer';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import VisitPDFTemplate from '../components/VisitPDFTemplate';

class VisitController{
    static async create(req: Request, res: Response){
        try {
            // 🔍 Récupération body
            const { hiveId, visitActions } = req.body;
            
            // ✅ Validation basique
            if (!hiveId || !visitActions || typeof visitActions !== 'object') {
                return res.status(400).json({ 
                    error: "hiveId et visitActions sont requis" 
                });
            }
            
            // 🚀 Appel service avec données validées
            const visit = await VisitService.create({
                hiveId,
                visitActions
            });
            
            res.status(201).json(visit);
        } catch (error) {
            console.error("Erreur création visite:", error);
            res.status(500).json({
                error: "Erreur serveur lors de la création de la visite" 
            });
        }
    }

    static async findAllByHive(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const visits = await VisitService.findAllByHive(id);
            res.status(200).json(visits);
        } catch (error) {
            console.error("Erreur récupération visites:", error);
            res.status(500).json();
        }
    }

    // 📄 Génération PDF fiche de visite
    static async generatePDF(req: Request, res: Response) {
        try {
            const visitId = parseInt(req.params.id);
            
            // 📋 Récupération données visite complètes
            const visit = await VisitService.findById(visitId);
            if (!visit) {
                return res.status(404).json({ error: "Visite non trouvée" });
            }

            // 📊 Calcul numéro de visite pour cette ruche spécifique
            const allVisitsForHive = await VisitService.findAllByHive(visit.hiveId);
            // Trier par date pour avoir la bonne position chronologique
            const sortedVisits = allVisitsForHive.sort((a, b) => 
                new Date(a.date).getTime() - new Date(b.date).getTime()
            );
            const visitNumber = sortedVisits.findIndex(v => v.id === visitId) + 1;

            // 🌤️ Récupération données contexte temps réel
            // 🔍 Extraction apiaryId depuis la visite
            const apiaryId = visit.hive.apiary_hives?.[0]?.apiary?.id;
            
            // 📅 Calcul période apicole actuelle
            const currentPeriod = ActionService.getCurrentPeriod();
            
            // 🌤️ Récupération météo temps réel spécifique au rucher
            const weatherData = await ActionService.getCurrentWeather(apiaryId);
            
            const contextData = {
                weather: weatherData,
                period: currentPeriod  // Déjà converti en label utilisateur par ActionService
            };

            // 🎨 Génération HTML depuis composant React
            const htmlContent = renderToStaticMarkup(
                React.createElement(VisitPDFTemplate, {
                    visit: { ...visit, visitNumber },
                    weather: contextData.weather,
                    period: contextData.period
                })
            );

            // 🚀 Lancement Puppeteer pour génération PDF
            const browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage'
                ]
            });

            const page = await browser.newPage();
            
            // 📄 Configuration format A4
            await page.setContent(`<!DOCTYPE html>${htmlContent}`, {
                waitUntil: 'networkidle0'
            });

            // 🎯 Génération PDF avec options
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

            // 📤 Envoi PDF au client
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="fiche-visite-${visitId}.pdf"`);
            res.send(pdfBuffer);

        } catch (error) {
            console.error("Erreur génération PDF:", error);
            res.status(500).json({ 
                error: "Erreur lors de la génération du PDF" 
            });
        }
    }
}
export default VisitController;