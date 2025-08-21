import { useState } from "react";

// Interface TypeScript pour les props
interface ActionButtonProps {
  action: {
    id: number;
    label: string;
    actionType: 'CYCLE' | 'INCREMENT';
    incrementStep?: number;
    action_options: Array<{
      option: {
        label: string;
      }
    }>;
  };
  onValueChange: (value: string | number) => void;
}

function ActionButton(props: ActionButtonProps) {
  const [currentIndex, setCurrentIndex] = useState(0); // État pour CYCLE (index option)
  const [currentValue, setCurrentValue] = useState(0); // État pour INCREMENT (valeur numérique)

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
