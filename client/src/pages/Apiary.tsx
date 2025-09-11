import axios from "../config/axiosConfig";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { HIVE_TYPES, HIVE_STATUS } from "../constants/index";
import { Home, LocationOn, Hive, Add, ArrowBack, WbSunny, Circle, ChevronRight } from "@mui/icons-material";
import { IconButton } from "@mui/material";

function Apiary() {
  const [hives, setHives] = useState<any[]>([]);
  const [apiary, setApiary] = useState<any>(null);
  const params = useParams();
  const apiaryId = params['apiary-id'];

  const navigate = useNavigate();

  async function fetchHives() {
    const response = await axios.get(
      `/api/hives?apiaryId=${apiaryId}`
    );
    setHives(response.data);
  }

  async function fetchApiary() {
    try {
      const response = await axios.get(`/api/apiaries/${apiaryId}`);
      setApiary(response.data);
    } catch (error) {
      console.error('Erreur récupération rucher:', error);
    }
  }

  useEffect(() => {
    fetchHives();
    fetchApiary();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header responsive */}
      <div className="mb-6">
        {/* Ligne principale : flèche + icône + nom */}
        <div className="flex items-center gap-3 mb-3">
          <IconButton
            onClick={() => navigate('/ruchers')}
            className="text-gray-600 hover:text-blue-600"
            size="small"
          >
            <ArrowBack />
          </IconButton>
          <Home className="text-blue-600" fontSize="large" />
          <h1 className="text-2xl font-semibold text-gray-800 truncate">
            {apiary?.name || 'Rucher'}
          </h1>
        </div>
        
        {/* Ligne secondaire : adresse et météo */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-1 text-gray-600 text-sm min-w-0 flex-1">
            <LocationOn fontSize="small" className="text-gray-400 flex-shrink-0 mt-0.5" />
            <span className="break-words">{apiary?.address}</span>
          </div>
          
          {/* Météo discrète */}
          {apiary?.weather && (
            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-lg flex-shrink-0">
              <WbSunny fontSize="small" className="text-blue-600" />
              <span className="text-sm font-medium">{apiary.weather.temperature}°C</span>
              <span className="text-xs text-gray-500">{apiary.weather.condition}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Hive className="text-blue-600" fontSize="small" />
          Ruches ({hives.length})
        </h2>
        <Link to={`/ruchers/${apiaryId}/ruches/nouvelle`} className="hidden sm:block">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            <Add fontSize="small" />
            Ajouter une ruche
          </button>
        </Link>
      </div>

      {/* Liste des ruches minimaliste */}
      {hives.length > 0 ? (
        <div className="grid gap-3">
          {hives.map((hive) => (
            <div 
              key={hive.id} 
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm hover:border-blue-300 transition-all cursor-pointer"
              onClick={()=> navigate(`/ruchers/${apiaryId}/ruches/${hive.id}`)}>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Hive className="text-blue-600" fontSize="small" />
                  <div>
                    <h3 className="font-semibold text-gray-800">{hive.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                      {/* Statut */}
                      <span className={`flex items-center gap-1 ${
                        hive.status === 'ACTIVE' 
                          ? 'text-green-600' 
                          : 'text-gray-500'
                      }`}>
                        <Circle fontSize="small" className="text-current" />
                        {HIVE_STATUS.find(status => status.value === hive.status)?.label}
                      </span>
                      
                      {/* Type */}
                      <span className="text-gray-500">
                        • {HIVE_TYPES.find(type => type.value === hive.type)?.label}
                      </span>
                      
                      {/* Couleur */}
                      {hive.color && (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">•</span>
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: hive.color }}
                            title={hive.color}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <ChevronRight className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Hive className="text-gray-400 mb-2" fontSize="large" />
          <p className="text-gray-500">Aucune ruche trouvée</p>
        </div>
      )}

      {/* FAB Mobile uniquement */}
      <div className="sm:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => navigate(`/ruchers/${apiaryId}/ruches/nouvelle`)}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center"
        >
          <Add className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
export default Apiary;
