import axios from "../config/axiosConfig";
import { useState } from "react";
import { useNavigate } from "react-router";
import { APIARY_NAMES } from "../constants/index";
import AddressAutocomplete from "../components/AddressAutocomplete";
import { Home, Shuffle, LocationOn, Save, ArrowBack } from "@mui/icons-material";
import { IconButton } from "@mui/material";

function NewApiary() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: 0,
    longitude: 0,
  });
  const navigate = useNavigate();
  
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    
    if (!formData.name || !formData.address || !formData.latitude || !formData.longitude) {
      alert('Veuillez remplir tous les champs et sélectionner une adresse depuis les suggestions');
      return;
    }
    
    try {
      const response = await axios.post('/api/apiaries', formData);
      navigate(`/ruchers/${response.data.apiary.id}`);
    } catch (error) {
      console.log(error);
      alert('Erreur lors de la création du rucher');
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;

    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [name]: value
      };
    });
  }

  function generateRandomApiaryName() {
    const randomIndex = Math.floor(Math.random() * APIARY_NAMES.length);
    const randomName = APIARY_NAMES[randomIndex];
    setFormData(prevFormData => ({
      ...prevFormData,
      name: randomName
    }));
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <IconButton
          onClick={() => navigate('/ruchers')}
          className="text-gray-600 hover:text-blue-600"
          size="small"
        >
          <ArrowBack />
        </IconButton>
        <Home className="text-blue-600" fontSize="large" />
        <h1 className="text-2xl font-semibold text-gray-800">Nouveau rucher</h1>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Home fontSize="small" className="text-blue-600" />
              Nom du rucher
            </label>
            <div className="flex gap-2">
              <input
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                name="name"
                placeholder="ex: Les Coteaux, Val Fleuri..."
                onChange={handleChange}
                value={formData.name}
              />
              <IconButton
                type="button"
                onClick={generateRandomApiaryName}
                className="border border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                title="Générer un nom aléatoire"
                size="medium"
              >
                <Shuffle className="text-gray-600 hover:text-blue-600" />
              </IconButton>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <LocationOn fontSize="small" className="text-blue-600" />
              Adresse complète
            </label>
            <AddressAutocomplete
              value={formData.address}
              onChange={(address) => setFormData(prev => ({ ...prev, address }))}
              onCoordinatesChange={(latitude, longitude) => setFormData(prev => ({ ...prev, latitude, longitude }))}
              placeholder="ex: Rue Désirée Maroilles, 7783 Boussubois, Belgique..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {formData.latitude !== 0 && formData.longitude !== 0 && (
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Coordonnées GPS : {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
              </p>
            )}
            {formData.address && formData.latitude === 0 && (
              <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                Veuillez sélectionner une adresse depuis les suggestions
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium"
          >
            <Save fontSize="small" />
            Créer le rucher
          </button>
        </form>
      </div>
    </div>
  );
}
export default NewApiary;
