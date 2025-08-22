interface VisitPDFTemplateProps {
  visit: {
    id: number;
    date: string;
    hive: {
      id: number;
      name: string;
      apiary?: {
        name: string;
        location: string;
      };
    };
    visitActions: Array<{
      id: number;
      value: string;
      action: {
        id: number;
        name: string;
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
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      lineHeight: '1.4'
    }}>
      {/* 📋 En-tête officiel */}
      <div style={{ 
        textAlign: 'center', 
        borderBottom: '2px solid #333', 
        paddingBottom: '20px',
        marginBottom: '30px' 
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          margin: '0 0 10px 0',
          color: '#2c3e50'
        }}>
          FICHE DE VISITE APICOLE
        </h1>
        <p style={{ 
          fontSize: '14px', 
          color: '#7f8c8d',
          margin: '0'
        }}>
          Mellisync - Gestion digitale de ruchers
        </p>
      </div>

      {/* 🏷️ Informations générales */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Identification */}
        <div>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: 'bold',
            marginBottom: '15px',
            color: '#34495e',
            borderBottom: '1px solid #bdc3c7',
            paddingBottom: '5px'
          }}>
            IDENTIFICATION
          </h3>
          <p><strong>Rucher :</strong> {visit.hive.apiary?.name || 'Non spécifié'}</p>
          <p><strong>Localisation :</strong> {visit.hive.apiary?.location || 'Non spécifiée'}</p>
          <p><strong>Ruche :</strong> {visit.hive.name} (ID: {visit.hive.id})</p>
          <p><strong>N° Visite :</strong> {visit.id}</p>
        </div>

        {/* Conditions */}
        <div>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: 'bold',
            marginBottom: '15px',
            color: '#34495e',
            borderBottom: '1px solid #bdc3c7',
            paddingBottom: '5px'
          }}>
            CONDITIONS
          </h3>
          <p><strong>Date :</strong> {formatDate(visit.date)}</p>
          <p><strong>Période :</strong> {period || 'Non calculée'}</p>
          <p><strong>Température :</strong> {weather?.temperature || '--'}°C</p>
          <p><strong>Météo :</strong> {weather?.condition || 'Non spécifiée'}</p>
        </div>
      </div>

      {/* ✅ Actions effectuées */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ 
          fontSize: '16px', 
          fontWeight: 'bold',
          marginBottom: '15px',
          color: '#34495e',
          borderBottom: '1px solid #bdc3c7',
          paddingBottom: '5px'
        }}>
          ACTIONS EFFECTUÉES
        </h3>
        
        {visit.visitActions.length === 0 ? (
          <p style={{ 
            fontStyle: 'italic',
            color: '#7f8c8d',
            textAlign: 'center',
            padding: '20px'
          }}>
            Aucune action enregistrée pour cette visite
          </p>
        ) : (
          <table style={{ 
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #bdc3c7'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#ecf0f1' }}>
                <th style={{ 
                  padding: '12px',
                  textAlign: 'left',
                  borderBottom: '1px solid #bdc3c7',
                  fontWeight: 'bold'
                }}>
                  Action
                </th>
                <th style={{ 
                  padding: '12px',
                  textAlign: 'left',
                  borderBottom: '1px solid #bdc3c7',
                  fontWeight: 'bold'
                }}>
                  Type
                </th>
                <th style={{ 
                  padding: '12px',
                  textAlign: 'left',
                  borderBottom: '1px solid #bdc3c7',
                  fontWeight: 'bold'
                }}>
                  Résultat
                </th>
              </tr>
            </thead>
            <tbody>
              {visit.visitActions.map((visitAction, index) => (
                <tr key={visitAction.id} style={{
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa'
                }}>
                  <td style={{ 
                    padding: '12px',
                    borderBottom: '1px solid #ecf0f1'
                  }}>
                    <strong>{visitAction.action.name}</strong>
                    {visitAction.action.description && (
                      <div style={{ 
                        fontSize: '12px',
                        color: '#7f8c8d',
                        marginTop: '4px'
                      }}>
                        {visitAction.action.description}
                      </div>
                    )}
                  </td>
                  <td style={{ 
                    padding: '12px',
                    borderBottom: '1px solid #ecf0f1'
                  }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      backgroundColor: visitAction.action.actionType === 'CYCLE' ? '#3498db' : '#2ecc71',
                      color: 'white'
                    }}>
                      {visitAction.action.actionType}
                    </span>
                  </td>
                  <td style={{ 
                    padding: '12px',
                    borderBottom: '1px solid #ecf0f1',
                    fontWeight: 'bold'
                  }}>
                    {visitAction.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 📝 Zone observations */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ 
          fontSize: '16px', 
          fontWeight: 'bold',
          marginBottom: '15px',
          color: '#34495e',
          borderBottom: '1px solid #bdc3c7',
          paddingBottom: '5px'
        }}>
          OBSERVATIONS COMPLÉMENTAIRES
        </h3>
        <div style={{
          border: '1px solid #bdc3c7',
          minHeight: '80px',
          padding: '15px',
          backgroundColor: '#f8f9fa'
        }}>
          <p style={{ 
            fontStyle: 'italic',
            color: '#7f8c8d',
            margin: '0'
          }}>
            [Zone réservée aux observations manuscrites ou complémentaires]
          </p>
        </div>
      </div>

      {/* ✍️ Signature */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        marginTop: '50px'
      }}>
        <div>
          <p style={{ fontWeight: 'bold', marginBottom: '40px' }}>
            Apiculteur :
          </p>
          <div style={{ 
            borderTop: '1px solid #000',
            paddingTop: '5px',
            textAlign: 'center',
            fontSize: '12px'
          }}>
            Signature et date
          </div>
        </div>
        <div>
          <p style={{ fontWeight: 'bold', marginBottom: '40px' }}>
            Témoin/Assistant :
          </p>
          <div style={{ 
            borderTop: '1px solid #000',
            paddingTop: '5px',
            textAlign: 'center',
            fontSize: '12px'
          }}>
            Signature et date
          </div>
        </div>
      </div>

      {/* 🔒 Pied de page */}
      <div style={{
        marginTop: '40px',
        padding: '15px',
        backgroundColor: '#ecf0f1',
        textAlign: 'center',
        fontSize: '10px',
        color: '#7f8c8d',
        borderTop: '1px solid #bdc3c7'
      }}>
        <p style={{ margin: '0 0 5px 0' }}>
          Document généré automatiquement par Mellisync
        </p>
        <p style={{ margin: '0' }}>
          Fiche de visite n°{visit.id} - {new Date().toLocaleDateString('fr-FR')}
        </p>
      </div>
    </div>
  );
}

export default VisitPDFTemplate;