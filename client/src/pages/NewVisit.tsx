import axios from "../config/axiosConfig";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import ActionButton from "../components/ActionButton";
import Toast from "../components/Toast";

function NewVisit() {
  const { "hive-id": hiveId, "apiary-id": apiaryId } = useParams<{ "hive-id": string, "apiary-id": string }>(); //Récupération params depuis URL
  const navigate = useNavigate();
  const [actions, setActions] = useState<any[]>([]);
  const [visitActions, setVisitActions] = useState({});
  const [toast, setToast] = useState({ message: "", type: "", isVisible: false });
  
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
      setToast({ message: "Erreur : ID de ruche manquant", type: "error", isVisible: true });
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

      //Succès : Toast simple + redirection retardée
      setToast({ message: "Visite enregistrée", type: "success", isVisible: true });
      console.log("Visite sauvée:", response.data);
      
      //Redirection automatique vers la vue de la ruche après délai pour voir le toast
      setTimeout(() => {
        navigate(`/ruchers/${apiaryId}/ruches/${hiveId}`);
      }, 1500);
      
    } catch (error) {
      //Erreur : Toast d'erreur simple
      console.error("Erreur sauvegarde visite:", error);
      setToast({ message: "Erreur lors de l'enregistrement", type: "error", isVisible: true });
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
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
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
        className={`mt-4 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
          isSaving 
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
        }`}
      >
        {isSaving ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-gray-200 border-t-transparent rounded-full"></div>
            Enregistrement...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Enregistrer visite
          </>
        )}
      </button>
    </div>
  );
}
export default NewVisit;
