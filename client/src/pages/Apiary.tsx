import axios from "../config/axiosConfig";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

function Apiary() {
  const [hives, setHives] = useState<any[]>([]);
  const params = useParams();
  const apiaryId = params['apiary-id'];

  const navigate = useNavigate();

  async function fetchHives() {
    // TODO: Configurer axios.defaults.withCredentials = true pour httpOnly cookies
    const response = await axios.get(
      `/api/hives?apiaryId=${apiaryId}`
    );
    setHives(response.data);
  }

  useEffect(() => {
    fetchHives();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Page Rucher</h1>
      <Link to={`/ruchers/${apiaryId}/ruches/nouvelle`} className="hidden sm:block">
        <input
          type="button"
          value="Ajouter une ruche"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
        />
      </Link>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Ruches</h2>
        {hives.length > 0 ? (
          <div className="grid gap-3">
            {hives.map((hive) => (
              <div 
                key={hive.id} 
                className="bg-gray-50 rounded-lg p-4 border cursor-pointer"
                onClick={()=> navigate(`/ruchers/${apiaryId}/ruches/${hive.id}`)}>
                <h3 className="font-medium text-gray-900">{hive.name}</h3>
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
