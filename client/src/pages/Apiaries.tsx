import { useEffect, useState } from "react";
import axios from "../config/axiosConfig";
import { Link, useNavigate } from "react-router";
import { Home, LocationOn, Hive as HiveIcon, Add } from "@mui/icons-material";

function Apiaries() {
  const [apiaries, setApiaries] = useState<any[]>([]);
  const navigate = useNavigate();


  async function fetchApiaries() {
    const response = await axios.get(
      `/api/apiaries`
    );
    setApiaries(response.data);
  }

  useEffect(() => {
    fetchApiaries();
  }, []);

  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Home className="text-blue-600" fontSize="large" />
          <h2 className="text-2xl font-semibold text-gray-800">Liste des Ruchers</h2>
        </div>
        <Link to="/ruchers/nouveau" className="hidden sm:block">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            <Add fontSize="small" />
            Ajouter un rucher
          </button>
        </Link>
      </div>
      
      <div className="grid gap-4">
        {apiaries.map(apiary => (
          <div 
            key={apiary.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm hover:border-blue-300 transition-all duration-200 cursor-pointer"
            onClick={()=> navigate(`/ruchers/${apiary.id}`)}>
            <div className="flex items-start gap-3">
              <Home className="text-blue-600 mt-0.5" fontSize="small" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{apiary.name}</h3>
                <div className="flex items-center gap-1 text-gray-600 mb-3">
                  <LocationOn fontSize="small" className="text-gray-400" />
                  <span className="text-sm">{apiary.address}, {apiary.city}</span>
                </div>
                
                {/* Statistiques des ruches */}
                <div className="flex gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <HiveIcon fontSize="small" className="text-blue-600" />
                    <span className="text-gray-600">{apiary.hiveStats?.total || 0} ruches</span>
                  </div>
                  
                  {apiary.hiveStats?.active > 0 && (
                    <span className="text-gray-500">• {apiary.hiveStats.active} actives</span>
                  )}
                  
                  {apiary.hiveStats?.inactive > 0 && (
                    <span className="text-gray-500">• {apiary.hiveStats.inactive} inactives</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAB Mobile uniquement */}
      <div className="sm:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => navigate('/ruchers/nouveau')}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center"
        >
          <Add className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
export default Apiaries;
