import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";

function Apiaries() {
  const [apiaries, setApiaries] = useState<any[]>([]);
  const navigate = useNavigate();

  async function handleClick(apiaryId: number) {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/apiaries/${apiaryId}`
      );
      fetchApiaries();
    } catch (error) {
      console.log(error);
    }
  }

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
    <div>
      <h2>Liste des Ruchers</h2>
      <ul>
        {apiaries.map(apiary => (
          <li 
            key={apiary.id}
            onClick={()=> navigate(`/ruchers/${apiary.id}`)}>
            {apiary.name} {apiary.address} {apiary.city}
            {
              <input
                type="button"
                value="supprimer"
                className="border"
                onClick={() => handleClick(apiary.id)}
              />
            }
          </li>
        ))}
      </ul>
      <Link to="/ruchers/nouveau">
        <input type="button" value="Ajouter un rucher" className="border" />
      </Link>
    </div>
  );
}
export default Apiaries;
