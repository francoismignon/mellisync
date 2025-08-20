import axios from "axios";
import { useEffect, useState } from "react";

function NewVisit() {
  const [actions, setActions] = useState([]);
  const [buttonLabel, setButtonLabel] = useState("");
  const [buttonValue, setButtonValue] = useState("");
  const [index, setIndex] = useState(0);

  async function fetchActions() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/actions`);
      setActions(response.data);
      console.log("Fetched actions:", response.data);
    } catch (error) {
      console.error("Error fetching actions:", error);
      // Handle error appropriately, e.g., show a notification or alert
    }
  }
  
  useEffect(() => {
    fetchActions();
  }, []);
  
  useEffect(() => {
    if (actions.length > 0) {
      setButtonLabel(actions[0].label);
      setButtonValue(actions[0].action_options[index].option.label || "Default Option Label");
    }
  }, [actions]);

  function handleClick() {
    if (actions[0].actionType === "CYCLE") {
      // Supposons : ["Non", "Oui", "Peut-être"] (length = 3)
      // currentIndex = 0 → "Non"
      // nextIndex = (0 + 1) % 3 = 1 % 3 = 1 → "Oui"
      // currentIndex = 1 → "Oui"
      // nextIndex = (1 + 1) % 3 = 2 % 3 = 2 → "Peut-être"
      // currentIndex = 2 → "Peut-être"
      // nextIndex = (2 + 1) % 3 = 3 % 3 = 0 → "Non" ← BOUCLE !
      const nextIndex = (index + 1) % actions[0].action_options.length;
      setIndex(nextIndex);
      setButtonValue(actions[0].action_options[nextIndex].option.label || "Default Option Label");
    }
    //else if (actionType === "INCREMENT") {
  }


  return (

    <div>
        <button 
          className="border-2 border-gray-300 rounded-md p-2 mb-4 flex flex-col items-center"
          onClick={handleClick}
        >
          <div className="font-bold mb-2">{buttonLabel}</div>
          <div className="text-sm text-blue-500">{buttonValue}</div>
        </button>
    </div>
    // <div>
    //   <h1>New Visit</h1>
    //   {actions.map(action => 
    //     <li>{action.label} {action.actionType} 
    //     {
    //       action.action_options.map(option =>
    //         <li>{option.option.label}</li>
    //       )
    //     }</li>
    //   )}
    // </div>
  );
}
export default NewVisit;