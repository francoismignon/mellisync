"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
function VisitPDFTemplate({ visit, weather, period }) {
    // Formatage date française avec fuseau horaire local
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/Brussels' // Fuseau horaire belge
        });
    };
    return ((0, jsx_runtime_1.jsxs)("html", { children: [(0, jsx_runtime_1.jsxs)("head", { children: [(0, jsx_runtime_1.jsx)("meta", { charSet: "utf-8" }), (0, jsx_runtime_1.jsxs)("title", { children: ["Fiche Visite #", visit.id] }), (0, jsx_runtime_1.jsx)("style", { children: `
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.4;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          
          .header h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #2c3e50;
          }
          
          .header p {
            font-size: 14px;
            color: #7f8c8d;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
          }
          
          .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #34495e;
            border-bottom: 1px solid #bdc3c7;
            padding-bottom: 5px;
          }
          
          .info-grid p {
            margin-bottom: 8px;
          }
          
          .actions-section {
            margin-bottom: 40px;
          }
          
          .actions-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #bdc3c7;
            margin-top: 15px;
          }
          
          .actions-table th {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #bdc3c7;
            font-weight: bold;
            background-color: #ecf0f1;
          }
          
          .actions-table td {
            padding: 12px;
            border-bottom: 1px solid #ecf0f1;
          }
          
          .actions-table tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          
          .action-type {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            color: white;
          }
          
          .action-type.cycle {
            background-color: #3498db;
          }
          
          .action-type.increment {
            background-color: #2ecc71;
          }
          
          .action-description {
            font-size: 12px;
            color: #7f8c8d;
            margin-top: 4px;
          }
          
          .observations {
            margin-bottom: 40px;
          }
          
          .observations-box {
            border: 1px solid #bdc3c7;
            min-height: 80px;
            padding: 15px;
            background-color: #f8f9fa;
          }
          
          .observations-box p {
            font-style: italic;
            color: #7f8c8d;
          }
          
          .signatures {
            margin-top: 50px;
          }
          
          .signature-box {
            text-align: center;
          }
          
          .signature-line {
            border-top: 1px solid #000;
            padding-top: 5px;
            margin-top: 40px;
            font-size: 12px;
          }
          
          .footer {
            margin-top: 40px;
            padding: 15px;
            background-color: #ecf0f1;
            text-align: center;
            font-size: 10px;
            color: #7f8c8d;
            border-top: 1px solid #bdc3c7;
          }
          
          .footer p {
            margin-bottom: 5px;
          }
          
          .no-actions {
            font-style: italic;
            color: #7f8c8d;
            text-align: center;
            padding: 20px;
          }
          
          @media print {
            body {
              max-width: none;
              margin: 0;
              padding: 15px;
            }
          }
        ` })] }), (0, jsx_runtime_1.jsxs)("body", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "header", children: [(0, jsx_runtime_1.jsx)("h1", { children: "FICHE DE VISITE APICOLE" }), (0, jsx_runtime_1.jsx)("p", { children: "Mellisync - Gestion digitale de ruchers" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "info-grid", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "section-title", children: "IDENTIFICATION" }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Rucher :" }), " ", visit.hive.apiary_hives?.[0]?.apiary.name || 'Non spécifié'] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Localisation :" }), " ", visit.hive.apiary_hives?.[0]?.apiary.address && visit.hive.apiary_hives?.[0]?.apiary.city
                                                ? `${visit.hive.apiary_hives[0].apiary.address}, ${visit.hive.apiary_hives[0].apiary.city}`
                                                : 'Non spécifiée'] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Ruche :" }), " ", visit.hive.name] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "N\u00B0 Visite :" }), " ", visit.visitNumber || 'N/A'] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "section-title", children: "CONDITIONS" }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Date :" }), " ", formatDate(visit.date)] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "P\u00E9riode :" }), " ", period || 'Non calculée'] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Temp\u00E9rature :" }), " ", weather?.temperature || '--', "\u00B0C"] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "M\u00E9t\u00E9o :" }), " ", weather?.condition || 'Non spécifiée'] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "actions-section", children: [(0, jsx_runtime_1.jsx)("h3", { className: "section-title", children: "ACTIONS EFFECTU\u00C9ES" }), visit.visitActions.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { className: "no-actions", children: "Aucune action enregistr\u00E9e pour cette visite" })) : ((0, jsx_runtime_1.jsxs)("table", { className: "actions-table", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { children: "Action" }), (0, jsx_runtime_1.jsx)("th", { children: "R\u00E9sultat" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: visit.visitActions.map((visitAction) => ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsxs)("td", { children: [(0, jsx_runtime_1.jsx)("strong", { children: visitAction.action.label }), visitAction.action.description && ((0, jsx_runtime_1.jsx)("div", { className: "action-description", children: visitAction.action.description }))] }), (0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)("strong", { children: visitAction.value }) })] }, visitAction.id))) })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "observations", children: [(0, jsx_runtime_1.jsx)("h3", { className: "section-title", children: "OBSERVATIONS COMPL\u00C9MENTAIRES" }), (0, jsx_runtime_1.jsx)("div", { className: "observations-box", children: (0, jsx_runtime_1.jsx)("p", { children: "[Zone r\u00E9serv\u00E9e aux observations manuscrites ou compl\u00E9mentaires]" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "signatures", children: (0, jsx_runtime_1.jsxs)("div", { className: "signature-box", children: [(0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)("strong", { children: "Apiculteur :" }) }), (0, jsx_runtime_1.jsx)("div", { className: "signature-line", children: "Signature et date" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "footer", children: [(0, jsx_runtime_1.jsx)("p", { children: "Document g\u00E9n\u00E9r\u00E9 automatiquement par Mellisync" }), (0, jsx_runtime_1.jsxs)("p", { children: ["Fiche de visite n\u00B0", visit.visitNumber || visit.id, " - ", new Date().toLocaleDateString('fr-FR')] })] })] })] }));
}
exports.default = VisitPDFTemplate;
//# sourceMappingURL=VisitPDFTemplate.js.map