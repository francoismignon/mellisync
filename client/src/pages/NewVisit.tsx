import axios from "axios";
import { useEffect, useState } from "react";
import ActionButton from "../components/ActionButton";

function NewVisit() {
  const [actions, setActions] = useState<any[]>([]);
  const [visitActions, setVisitActions] = useState({});
  
  // États pour filtrage intelligent (hardcodés pour MVP, API météo plus tard)
  const currentTemperature = 15; // °C - sera remplacé par call OpenWeatherMap
  const currentWeather = "Ensoleillé"; // Sera récupéré via API
  const [expertMode, setExpertMode] = useState<boolean>(false);

  async function fetchActions() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/actions`
      );
      setActions(response.data);
      console.log("Fetched actions:", response.data);
    } catch (error) {
      console.error("Error fetching actions:", error);
    }
  }

  useEffect(() => {
    fetchActions();
  }, []);


  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <h2 className="text-xl font-bold">Nouvelle visite</h2>
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
            currentTemperature={currentTemperature}
            currentWeather={currentWeather}
            expertMode={expertMode}
            onValueChange={(value) =>{
              setVisitActions(prevActions => ({
                ...prevActions,
                [action.id]: value
              }));
            }} />
        )}
      </div>

      <input 
        type="button" 
        value="Enregistrer visite"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={()=> console.log(visitActions)} />
    </div>
  );
}
export default NewVisit;
