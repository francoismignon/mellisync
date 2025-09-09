import axios from "../config/axiosConfig";
import { useState } from "react";
import { useNavigate } from "react-router";
import { APIARY_NAMES } from "../constants/index";
import AddressAutocomplete from "../components/AddressAutocomplete";

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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Formulaire de création de rucher</h1>
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom du rucher</label>
            <div className="flex gap-2">
              <input
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                name="name"
                placeholder="ex: Les Coteaux, Val Fleuri..."
                onChange={handleChange}
                value={formData.name}
              />
              <button
                type="button"
                onClick={generateRandomApiaryName}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors duration-200 flex items-center justify-center"
                title="Générer un nom aléatoire"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adresse complète</label>
            <AddressAutocomplete
              value={formData.address}
              onChange={(address) => setFormData(prev => ({ ...prev, address }))}
              onCoordinatesChange={(latitude, longitude) => setFormData(prev => ({ ...prev, latitude, longitude }))}
              placeholder="ex: Rue Désirée Maroilles, 7783 Boussubois, Belgique..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {formData.latitude !== 0 && formData.longitude !== 0 && (
              <p className="text-xs text-green-600 mt-1">
                ✅ Coordonnées GPS : {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
              </p>
            )}
            {formData.address && formData.latitude === 0 && (
              <p className="text-xs text-amber-600 mt-1">
                ⚠️ Veuillez sélectionner une adresse depuis les suggestions pour obtenir les coordonnées GPS
              </p>
            )}
          </div>
          <input 
            type="submit" 
            value="Ajouter rucher" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer font-medium"
          />
        </form>
      </div>
    </div>
  );
}
export default NewApiary;
