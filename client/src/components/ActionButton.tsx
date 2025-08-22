import { useEffect, useState } from "react";

// 🎯 Interface TypeScript simplifiée - Backend filtre tout !
interface ActionButtonProps {
  action: {
    id: number;
    label: string;
    actionType: 'CYCLE' | 'INCREMENT';
    incrementStep?: number;
    // ⚠️ Props supprimées : Plus nécessaires car backend filtre
    // temperatureMin, temperatureMax, restrictions météo gérées côté serveur
    action_options: Array<{
      option: {
        label: string;
      }
    }>;
  };
  // 🔥 Props supprimées : Plus de props météo/température/expertMode
  // Le backend envoie seulement les actions autorisées !
  onValueChange: (value: string | number) => void;
}

function ActionButton(props: ActionButtonProps) {
  const [currentIndex, setCurrentIndex] = useState(0); // État pour CYCLE (index option)
  const [currentValue, setCurrentValue] = useState(0); // État pour INCREMENT (valeur numérique)

  useEffect(() => {
    // Envoyer valeur par défaut au parent automatiquement
    if (props.action.actionType === "CYCLE") {
      const defaultValue = props.action.action_options[0]?.option.label;
      props.onValueChange(defaultValue);
    } else {
      props.onValueChange(0);
    }
  }, []); // Au mount du composant

  // 🗑️ LOGIQUE SUPPRIMÉE : Plus de shouldDisplay() !
  // Le backend envoie seulement les actions autorisées maintenant.
  // Si ActionButton est rendu = action autorisée par définition !

  // 📊 Calcul valeur affichée selon type action (logique inchangée)
  function getCurrentValue() {
    if (props.action.actionType === "CYCLE") {
      return props.action.action_options[currentIndex]?.option.label || "Default Option Label";
    } else if (props.action.actionType === "INCREMENT") {
      return currentValue;
    }
    return "Type d'action inconnu";
  }

  // 🎮 Gestion clic : cycle options (CYCLE) ou incrémente valeur (INCREMENT) 
  function handleClick() {
    if (props.action.actionType === "CYCLE") {
      // Cycle parmi les options disponibles (Oui/Non, Faible/Moyen/Fort, etc.)
      const nextIndex = (currentIndex + 1) % props.action.action_options.length;
      setCurrentIndex(nextIndex);
      
      const nextValue = props.action.action_options[nextIndex]?.option.label;
      props.onValueChange(nextValue); // Remonte nouvelle valeur au parent (NewVisit)
    } else if (props.action.actionType === "INCREMENT") {
      // Incrémente par pas défini (0.5kg, 1L, 5 varroas, etc.)
      const newValue = currentValue + Number(props.action.incrementStep || 1);
      setCurrentValue(newValue);
      props.onValueChange(newValue); // Remonte nouvelle valeur au parent (NewVisit)
    }
  }

  // 🎨 Rendu : Bouton toujours affiché (actions pré-filtrées par backend)
  return (
    <button 
        className="border-2 border-gray-300 rounded-md p-2 mb-4 flex flex-col items-center hover:bg-gray-50"
        onClick={handleClick}
    >
      <div className="font-bold mb-2">{props.action.label}</div>
      <div className="text-sm text-blue-500">{getCurrentValue()}</div>
    </button>
  );
}
export default ActionButton;
