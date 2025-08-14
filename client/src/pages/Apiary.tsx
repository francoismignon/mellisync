import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

function Apiary() {
  const [hives, setHives] = useState<any[]>([]);
  const params = useParams();

  async function fetchHives() {
    const apiaryId = params["apiary-id"];
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/apiaries/${apiaryId}/hives`
    );
    setHives(response.data);
  }

  useEffect(() => {
    fetchHives();
  }, []);

  return (
    <div>
      <h1>Page Rucher</h1>
      <ul>
        {hives.map((hive) => (
          <li key={hive.id}>{hive.name}</li>
        ))}
      </ul>
    </div>
  );
}
export default Apiary;
