import axios from "axios";
import { useEffect, useState } from "react";

function NewVisit() {
  const [actions, setActions] = useState([]);
  const [actionStates, setActionStates] = useState({});

  // Fetch actions depuis la nouvelle API
  async function fetchActions() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/actions`
      );
      setActions(response.data);
      console.log("Actions chargées:", response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des actions:", error);
    }
  }

  useEffect(() => {
    fetchActions();
  }, []);

  // Filtrer pour avoir seulement les 2 actions de test
  const testActions = actions.filter(action => 
    action.id === 1 || action.id === 6 // Présence reine (toggle) et Réserves (weight)
  );

  // Récupérer l'état actuel d'une action
  function getActionState(actionId) {
    return actionStates[actionId] || 0; // 0 = état par défaut
  }

  // Afficher la valeur selon le type d'action
  function getActionDisplay(action) {
    const state = getActionState(action.id);
    
    if (action.actionType === 'toggle') {
      // Pour l'action 1 (reine), les options sont "Non" (0) et "Oui" (1)
      const options = action.action_options?.map(ao => ao.option.label) || ["Non", "Oui"];
      return options[state] || "Non";
    }
    
    if (action.actionType === 'weight') {
      return `${state.toFixed(1)} kg`;
    }
    
    return state;
  }

  function handleActionClick(action) {
    if (action.actionType === 'toggle') {
      // Alterner entre 0 et 1 pour toggle
      setActionStates(prev => ({
        ...prev,
        [action.id]: prev[action.id] === 1 ? 0 : 1
      }));
    }
  }

  return (
    <div>
      <h1>Test Page NewVisit</h1>
      
      <p>Nombre d'actions chargées: {actions.length}</p>
      <p>Actions de test affichées: {testActions.length}</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        {testActions.map((action) => (
          <button 
            key={action.id}
            onClick={() => handleActionClick(action)}
            style={{
              padding: '15px',
              border: '2px solid #ccc',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: '14px'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              {action.label}
            </div>
            <div style={{ color: '#0066cc', fontSize: '16px' }}>
              {getActionDisplay(action)}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
              ({action.actionType})
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default NewVisit;