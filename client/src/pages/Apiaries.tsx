import { useEffect, useState } from "react";
import axios from "../config/axiosConfig";
import { Link, useNavigate } from "react-router";

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
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Liste des Ruchers</h2>
        <Link to="/ruchers/nouveau" className="hidden sm:block">
          <input 
            type="button" 
            value="Ajouter un rucher" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
          />
        </Link>
      </div>
      
      <div className="grid gap-4">
        {apiaries.map(apiary => (
          <div 
            key={apiary.id}
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={()=> navigate(`/ruchers/${apiary.id}`)}>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{apiary.name}</h3>
              <p className="text-gray-600">{apiary.address}, {apiary.city}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FAB Mobile uniquement */}
      <div className="sm:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => navigate('/ruchers/nouveau')}
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
export default Apiaries;
