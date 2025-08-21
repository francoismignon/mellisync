import axios from "axios";
import { useEffect, useState } from "react";
import ActionButton from "../components/ActionButton";

function NewVisit() {
  const [actions, setActions] = useState<any[]>([]);
  const [visitActions, setVisitActions] = useState({});

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
      {actions.map(action =>
        <ActionButton
          key={action.id}
          action={action}
          onValueChange={(value) =>{
            setVisitActions(prevActions => ({
              ...prevActions,
              [action.id]: value
            }));
          }} />
      )}
    </div>
  );
}
export default NewVisit;
