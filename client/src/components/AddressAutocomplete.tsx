import { useState, useEffect } from 'react';
import axios from '../config/axiosConfig';

interface AddressSuggestion {
  display_name: string;
  clean_address: string;
  latitude: number;
  longitude: number;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onCoordinatesChange: (latitude: number, longitude: number) => void;
  placeholder?: string;
  className?: string;
}

function AddressAutocomplete({ value, onChange, onCoordinatesChange, placeholder = "Tapez votre adresse...", className = "" }: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSelectingSuggestion, setIsSelectingSuggestion] = useState(false);

  // Debounce pour éviter trop d'appels API
  useEffect(() => {
    // Ne pas rechercher si on est en train de sélectionner une suggestion
    if (isSelectingSuggestion) {
      return;
    }

    if (value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/addresses/suggestions?q=${encodeURIComponent(value)}`);
        setSuggestions(response.data.suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Erreur autocomplétion adresse:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // Attendre 300ms après la dernière saisie

    return () => clearTimeout(timeoutId);
  }, [value]); // Enlever isSelectingSuggestion des dépendances

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    setIsSelectingSuggestion(true); // Empêcher la recherche automatique
    onChange(suggestion.clean_address);
    onCoordinatesChange(suggestion.latitude, suggestion.longitude);
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Réinitialiser le flag après un petit délai
    setTimeout(() => {
      setIsSelectingSuggestion(false);
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleInputBlur = () => {
    // Délai pour permettre le clic sur suggestion
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        placeholder={placeholder}
        className={`${className} ${isLoading ? 'pr-10' : ''}`}
      />
      
      {/* Indicateur de chargement */}
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {/* Liste des suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-3 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">
                {suggestion.clean_address}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message si aucun résultat */}
      {showSuggestions && !isLoading && suggestions.length === 0 && value.length >= 3 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <div className="text-gray-500 text-sm">
            Aucune adresse trouvée pour "{value}"
          </div>
        </div>
      )}
    </div>
  );
}

export default AddressAutocomplete;