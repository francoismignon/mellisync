import { useState } from "react";

// Interface TypeScript pour les props
interface ActionButtonProps {
  action: {
    id: number;
    label: string;
    actionType: 'CYCLE' | 'INCREMENT';
    incrementStep?: number;
    temperatureMin?: number;
    temperatureMax?: number;
    action_options: Array<{
      option: {
        label: string;
      }
    }>;
    action_periode: Array<{
      periode: {
        name: string;
      }
    }>;
  };
  currentTemperature: number;
  currentWeather: string;
  expertMode: boolean;
  onValueChange: (value: string | number) => void;
}

function ActionButton(props: ActionButtonProps) {
  const [currentIndex, setCurrentIndex] = useState(0); // État pour CYCLE (index option)
  const [currentValue, setCurrentValue] = useState(0); // État pour INCREMENT (valeur numérique)

  // Fonction pour vérifier si l'action doit être affichée
  function shouldDisplay(): boolean {
    if (props.expertMode) return true; // Mode expert : tout afficher
    
    // Vérification température minimum
    if (props.action.temperatureMin && props.currentTemperature < props.action.temperatureMin) {
      return false;
    }
    
    // Vérification température maximum
    if (props.action.temperatureMax && props.currentTemperature > props.action.temperatureMax) {
      return false;
    }
    
    // Vérification météo (actions nécessitant ouverture ruche ≥15°C interdites par mauvais temps)
    const badWeathers = ["Pluie", "Averses", "Orage", "Vent fort"];
    if (props.action.temperatureMin && props.action.temperatureMin >= 15 && badWeathers.includes(props.currentWeather)) {
      return false;
    }
    
    return true;
  }

  // Early return si l'action ne doit pas être affichée
  if (!shouldDisplay()) {
    return null;
  }

  // Calcul valeur affichage selon type action
  function getCurrentValue() {
    if (props.action.actionType === "CYCLE") {
      return props.action.action_options[currentIndex]?.option.label || "Default Option Label";
    } else if (props.action.actionType === "INCREMENT") {
      return currentValue;
    }
    return "Type d'action inconnu";
  }

  // Gestion clic : cycle options (CYCLE) ou incrémente valeur (INCREMENT)
  function handleClick() {
    if (props.action.actionType === "CYCLE") {
      const nextIndex = (currentIndex + 1) % props.action.action_options.length;
      setCurrentIndex(nextIndex);
      
      const nextValue = props.action.action_options[nextIndex]?.option.label;
      props.onValueChange(nextValue); // Remonte nouvelle valeur au parent
    } else if (props.action.actionType === "INCREMENT") {
      const newValue = currentValue + Number(props.action.incrementStep || 1);
      setCurrentValue(newValue);
      props.onValueChange(newValue); // Remonte nouvelle valeur au parent
    }
  }

  return (
    <button 
        className="border-2 border-gray-300 rounded-md p-2 mb-4 flex flex-col items-center"
        onClick={handleClick}
    >
      <div className="font-bold mb-2">{props.action.label}</div>
      <div className="text-sm text-blue-500">{getCurrentValue()}</div>
    </button>
  );
}
export default ActionButton;
