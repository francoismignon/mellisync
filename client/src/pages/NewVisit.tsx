import axios from "../config/axiosConfig";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import ActionButton from "../components/ActionButton";
import Toast from "../components/Toast";
import { Assignment, ArrowBack, Save, WbSunny, Settings, AutoAwesome } from "@mui/icons-material";
import { IconButton } from "@mui/material";

function NewVisit() {
  const { "hive-id": hiveId, "apiary-id": apiaryId } = useParams<{ "hive-id": string, "apiary-id": string }>(); //Récupération params depuis URL
  const navigate = useNavigate();
  const [actions, setActions] = useState<any[]>([]);
  const [visitActions, setVisitActions] = useState({});
  const [toast, setToast] = useState({ message: "", type: "success" as "success" | "error", isVisible: false });
  
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
    <div className="max-w-4xl mx-auto">
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
      
      {/* Header avec retour */}
      <div className="flex items-center gap-3 mb-6">
        <IconButton
          onClick={() => navigate(`/ruchers/${apiaryId}/ruches/${hiveId}`)}
          className="text-gray-600 hover:text-blue-600"
          size="small"
        >
          <ArrowBack />
        </IconButton>
        <Assignment className="text-blue-600" fontSize="large" />
        <h1 className="text-2xl font-semibold text-gray-800">Nouvelle visite</h1>
      </div>
      
      {/* Contexte et mode */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Contexte météo */}
            {!expertMode && currentPeriod && (
              <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                <WbSunny fontSize="small" className="text-blue-600" />
                <span className="text-sm">{currentPeriod} • {currentTemperature}°C • {currentWeather}</span>
              </div>
            )}
          </div>
          
          {/* Sélecteur de mode */}
          <div className="flex rounded-lg overflow-hidden border border-gray-300">
            <button
              onClick={() => setExpertMode(false)}
              className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                !expertMode 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <AutoAwesome fontSize="small" />
              Mode Saison
            </button>
            <button
              onClick={() => setExpertMode(true)}
              className={`flex items-center gap-2 px-3 py-2 text-sm border-l border-gray-300 transition-colors ${
                expertMode 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Settings fontSize="small" />
              Mode Expert
            </button>
          </div>
        </div>
      </div>

      {/* Actions de visite */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      {/* Bouton d'action */}
      <div className="flex justify-center">
        <button 
          onClick={saveVisit}
          disabled={isSaving}
          className={`flex items-center justify-center gap-2 py-2.5 px-6 rounded-lg font-medium ${
            isSaving 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSaving ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-gray-200 border-t-transparent rounded-full"></div>
              Enregistrement...
            </>
          ) : (
            <>
              <Save fontSize="small" />
              Enregistrer visite
            </>
          )}
        </button>
      </div>
    </div>
  );
}
export default NewVisit;
