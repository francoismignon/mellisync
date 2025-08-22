// 📄 Template PDF pour génération fiche de visite côté serveur
import React from 'react';

interface VisitPDFTemplateProps {
  visit: {
    id: number;
    date: string;
    visitNumber?: number;
    hive: {
      id: number;
      name: string;
      apiary_hives?: Array<{
        apiary: {
          name: string;
          address: string;
          city: string;
        };
      }>;
    };
    visitActions: Array<{
      id: number;
      value: string;
      action: {
        id: number;
        label: string;
        actionType: 'CYCLE' | 'INCREMENT';
        description?: string;
      };
    }>;
  };
  weather?: {
    temperature: number;
    condition: string;
  };
  period?: string;
}

function VisitPDFTemplate({ visit, weather, period }: VisitPDFTemplateProps) {
  // 📅 Formatage date française
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>Fiche Visite #{visit.id}</title>
        <style>{`
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
        `}</style>
      </head>
      <body>
        {/* 📋 En-tête officiel */}
        <div className="header">
          <h1>FICHE DE VISITE APICOLE</h1>
          <p>Mellisync - Gestion digitale de ruchers</p>
        </div>

        {/* 🏷️ Informations générales */}
        <div className="info-grid">
          {/* Identification */}
          <div>
            <h3 className="section-title">IDENTIFICATION</h3>
            <p><strong>Rucher :</strong> {visit.hive.apiary_hives?.[0]?.apiary.name || 'Non spécifié'}</p>
            <p><strong>Localisation :</strong> {visit.hive.apiary_hives?.[0]?.apiary.address && visit.hive.apiary_hives?.[0]?.apiary.city 
              ? `${visit.hive.apiary_hives[0].apiary.address}, ${visit.hive.apiary_hives[0].apiary.city}` 
              : 'Non spécifiée'}</p>
            <p><strong>Ruche :</strong> {visit.hive.name}</p>
            <p><strong>N° Visite :</strong> {visit.visitNumber || 'N/A'}</p>
          </div>

          {/* Conditions */}
          <div>
            <h3 className="section-title">CONDITIONS</h3>
            <p><strong>Date :</strong> {formatDate(visit.date)}</p>
            <p><strong>Période :</strong> {period || 'Non calculée'}</p>
            <p><strong>Température :</strong> {weather?.temperature || '--'}°C</p>
            <p><strong>Météo :</strong> {weather?.condition || 'Non spécifiée'}</p>
          </div>
        </div>

        {/* ✅ Actions effectuées */}
        <div className="actions-section">
          <h3 className="section-title">ACTIONS EFFECTUÉES</h3>
          
          {visit.visitActions.length === 0 ? (
            <p className="no-actions">
              Aucune action enregistrée pour cette visite
            </p>
          ) : (
            <table className="actions-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Résultat</th>
                </tr>
              </thead>
              <tbody>
                {visit.visitActions.map((visitAction) => (
                  <tr key={visitAction.id}>
                    <td>
                      <strong>{visitAction.action.label}</strong>
                      {visitAction.action.description && (
                        <div className="action-description">
                          {visitAction.action.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <strong>{visitAction.value}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 📝 Zone observations */}
        <div className="observations">
          <h3 className="section-title">OBSERVATIONS COMPLÉMENTAIRES</h3>
          <div className="observations-box">
            <p>[Zone réservée aux observations manuscrites ou complémentaires]</p>
          </div>
        </div>

        {/* ✍️ Signature */}
        <div className="signatures">
          <div className="signature-box">
            <p><strong>Apiculteur :</strong></p>
            <div className="signature-line">Signature et date</div>
          </div>
        </div>

        {/* 🔒 Pied de page */}
        <div className="footer">
          <p>Document généré automatiquement par Mellisync</p>
          <p>Fiche de visite n°{visit.visitNumber || visit.id} - {new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </body>
    </html>
  );
}

export default VisitPDFTemplate;