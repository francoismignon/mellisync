import axios from "../config/axiosConfig";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { HIVE_TYPES, HIVE_STATUS } from "../constants/index";

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
      {/* Header enrichi avec météo */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {apiary?.name || 'Rucher'}
            </h1>
            <p className="text-gray-600">📍 {apiary?.address}, {apiary?.city}</p>
          </div>
          
          {/* Météo locale */}
          {apiary?.weather && (
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {apiary.weather.temperature}°C
              </div>
              <div className="text-sm text-blue-800">
                {apiary.weather.condition}
              </div>
            </div>
          )}
        </div>
        
        <Link to={`/ruchers/${apiaryId}/ruches/nouvelle`} className="hidden sm:block">
          <input
            type="button"
            value="Ajouter une ruche"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
          />
        </Link>
      </div>

      {/* Liste des ruches enrichie */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Ruches ({hives.length})</h2>
        {hives.length > 0 ? (
          <div className="grid gap-3">
            {hives.map((hive) => (
              <div 
                key={hive.id} 
                className="bg-gray-50 rounded-lg p-4 border cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={()=> navigate(`/ruchers/${apiaryId}/ruches/${hive.id}`)}>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">{hive.name}</h3>
                    
                    {/* Informations détaillées */}
                    <div className="flex gap-3 text-sm">
                      {/* Statut */}
                      <div className="flex items-center gap-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          hive.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {HIVE_STATUS.find(status => status.value === hive.status)?.label}
                        </span>
                      </div>
                      
                      {/* Type */}
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600">
                          {HIVE_TYPES.find(type => type.value === hive.type)?.label}
                        </span>
                      </div>
                      
                      {/* Couleur */}
                      {hive.color && (
                        <div className="flex items-center gap-1">
                          <div 
                            className="w-5 h-5 rounded-full border border-gray-300"
                            style={{ backgroundColor: hive.color }}
                            title={hive.color}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Flèche */}
                  <div className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">Aucune ruche trouvée</p>
        )}
      </div>

      {/* FAB Mobile uniquement */}
      <div className="sm:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => navigate(`/ruchers/${apiaryId}/ruches/nouvelle`)}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
export default Apiary;
