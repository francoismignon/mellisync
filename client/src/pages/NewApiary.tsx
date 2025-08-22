import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { BELGIAN_CITIES } from "../constants/belgianCities";

function NewApiary() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
  });
  const navigate = useNavigate();
  
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/apiaries`,
        formData
      );
      //console.log(response.data);
      navigate(`/ruchers/${response.data.apiary.id}`); // si OK, renvoye vers la pages de liste de ruchers
    } catch (error) {
      console.log(error);
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
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Formulaire de création de rucher</h1>
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom du rucher</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              name="name"
              placeholder="ex: Rucher des Lilas"
              onChange={handleChange}
              value={formData.name}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="text"
              name="address"
              placeholder="ex: Rue de Melli"
              onChange={handleChange}
              value={formData.address}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              name="city"
              onChange={handleChange}
              value={formData.city}
              required
            >
              <option value="">Sélectionner une ville...</option>
              {BELGIAN_CITIES.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
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
