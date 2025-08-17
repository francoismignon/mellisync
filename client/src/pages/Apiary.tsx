import axios from "axios";
import { useEffect, useState } from "react";

function Apiary() {
  const [hives, setHives] = useState<any[]>([]);
  //const params = useParams();

  async function fetchHives() {
    // TODO: Configurer axios.defaults.withCredentials = true pour httpOnly cookies
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/hives`
    );
    setHives(response.data);
  }

  useEffect(() => {
    fetchHives();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Page Rucher</h1>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Ruches</h2>
        {hives.length > 0 ? (
          <div className="grid gap-3">
            {hives.map((hive) => (
              <div key={hive.id} className="bg-gray-50 rounded-lg p-4 border">
                <h3 className="font-medium text-gray-900">{hive.name}</h3>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">Aucune ruche trouvée</p>
        )}
      </div>
    </div>
  );
}
export default Apiary;
