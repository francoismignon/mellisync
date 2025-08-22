import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";

function Apiaries() {
  const [apiaries, setApiaries] = useState<any[]>([]);
  const navigate = useNavigate();


  async function fetchApiaries() {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/apiaries`
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
        <Link to="/ruchers/nouveau">
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
    </div>
  );
}
export default Apiaries;
