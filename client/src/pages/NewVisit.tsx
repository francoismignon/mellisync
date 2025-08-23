import axios from "../config/axiosConfig";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import ActionButton from "../components/ActionButton";

function NewVisit() {
  const { "hive-id": hiveId, "apiary-id": apiaryId } = useParams<{ "hive-id": string, "apiary-id": string }>(); //Récupération params depuis URL
  const navigate = useNavigate();
  const [actions, setActions] = useState<any[]>([]);
  const [visitActions, setVisitActions] = useState({});
  
  //États pour contexte apicole (maintenant fournis par backend)
  const [currentPeriod, setCurrentPeriod] = useState<string>("");
  const [currentTemperature, setCurrentTemperature] = useState<number>(0);
  const [currentWeather, setCurrentWeather] = useState<string>("");
  const [expertMode, setExpertMode] = useState<boolean>(false);
  
  //États pour gestion sauvegarde
  const [isSaving, setIsSaving] = useState<boolean>(false);


  //Fonction adaptée pour les 2 modes avec backend intelligent
  async function fetchActions() {
    try {
      // Mode normal : Actions pré-filtrées par backend avec contexte + météo spécifique au rucher
      // Mode expert : Toutes les actions sans filtre
      const endpoint = expertMode 
        ? `/api/actions`                                      // Toutes actions
        : `/api/actions?filter=current&apiaryId=${apiaryId}`;  // Actions filtrées + météo du rucher
      
      const response = await axios.get(endpoint);
      
      if (expertMode) {
        // Mode expert : Format classique actions[]
        setActions(response.data);
        // Pas de contexte fourni en mode expert
      } else {
        // Mode normal : Format { currentPeriod, currentTemperature, currentWeather, actions }
        const { currentPeriod, currentTemperature, currentWeather, actions } = response.data;
        setActions(actions);           // Actions pré-filtrées par backend
        setCurrentPeriod(currentPeriod);           // Période calculée par backend
        setCurrentTemperature(currentTemperature); // Température fournie par backend
        setCurrentWeather(currentWeather);         // Météo fournie par backend
      }
      
      console.log("Fetched actions:", response.data);
    } catch (error) {
      console.error("Error fetching actions:", error);
    }
  }

  //Fonction de sauvegarde visite
  async function saveVisit() {
    if (!hiveId) {
      alert("Erreur : ID de ruche manquant");
      return;
    }

    setIsSaving(true);
    
    try {
      //Envoi données au backend
      const response = await axios.post(
        `/api/visits`, 
        {
          hiveId: parseInt(hiveId),  // String URL → Number
          visitActions: visitActions  // Toutes les actions avec leurs valeurs
        }
      );

      //Succès : Confirmation utilisateur + redirection
      alert(`Visite enregistrée avec succès ! ID: ${response.data.id}`);
      console.log("Visite sauvée:", response.data);
      
      //Redirection automatique vers la vue de la ruche
      navigate(`/ruchers/${apiaryId}/ruches/${hiveId}`);
      
    } catch (error) {
      //Erreur : Affichage message utilisateur
      console.error("Erreur sauvegarde visite:", error);
      alert("Erreur lors de l'enregistrement de la visite");
    } finally {
      setIsSaving(false);
    }
  }

  //Re-fetch quand l'utilisateur change de mode ou de rucher
  useEffect(() => {
    fetchActions();
  }, [expertMode, apiaryId]); // Dépendances : mode + rucher spécifique


  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <h2 className="text-xl font-bold">Nouvelle visite</h2>
        
        {/*Affichage contexte apicole en mode normal */}
        {!expertMode && currentPeriod && (
          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
            {currentPeriod} • {currentTemperature}°C • {currentWeather}
          </div>
        )}
        
        <div className="ml-auto flex gap-1">
          <button
            onClick={() => setExpertMode(false)}
            className={`px-3 py-1 rounded-l ${!expertMode 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mode Saison
          </button>
          <button
            onClick={() => setExpertMode(true)}
            className={`px-3 py-1 rounded-r ${expertMode 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mode Expert
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {actions.map(action =>
          <ActionButton
            key={action.id}
            action={action}
            onValueChange={(value) =>{
              setVisitActions(prevActions => ({
                ...prevActions,
                [action.id]: value
              }));
            }} />
        )}
      </div>

      <button 
        onClick={saveVisit}
        disabled={isSaving}
        className={`mt-4 px-4 py-2 rounded ${
          isSaving 
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {isSaving ? "Enregistrement..." : "Enregistrer visite"}
      </button>
    </div>
  );
}
export default NewVisit;
