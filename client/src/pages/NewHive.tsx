import axios from "../config/axiosConfig";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { HIVE_TYPES, FRAME_COUNTS, HIVE_STATUS} from "../constants/index";
import Toast from "../components/Toast";

function NewHive() {
    
    const navigate = useNavigate();
    const params = useParams();
    const apiaryId = params['apiary-id'];
    const [toast, setToast] = useState({ message: "", type: "success" as "success" | "error", isVisible: false });
    const [formData, setFormData] = useState({
      name: "",
      type: "DADANT", //valeur par defaut pareille que pour les enum dans mon schéma prisma
      framecount: "FRAME_10",
      status: "ACTIVE",
      color: "",
      yearBuilt: "",
    });


  async function handleSubmit(event: React.FormEvent){
    event.preventDefault();
    try {
       const response = await axios.post(
        `/api/hives`,
        {
            ...formData,
            apiaryId: apiaryId
        }
      );
      
      setToast({ message: "Ruche créée avec succès", type: "success", isVisible: true });
      
      // Redirection après délai pour voir le toast
      setTimeout(() => {
        navigate(`/ruchers/${apiaryId}/ruches/${response.data.hive.id}`);
      }, 1500);
      
    } catch (error) {
        console.log(error);
        setToast({ message: "Erreur lors de la création", type: "error", isVisible: true });
    }

  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>){
    const {name, value} = event.target;

    setFormData(prevFormData => {
        return {
            ...prevFormData,
            [name]: value
        }
    });
  }

  return (
    <div className="max-w-2xl mx-auto">
        <Toast 
            message={toast.message}
            type={toast.type}
            isVisible={toast.isVisible}
            onClose={() => setToast({ ...toast, isVisible: false })}
        />
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Formulaire de création de ruche</h1>
        <div className="bg-white rounded-lg shadow-sm border p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la ruche</label>
                    <input 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        type="text"
                        name="name"
                        value={formData.name}
                        placeholder="ex: Margueritte"
                        onChange={handleChange} 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type de ruche</label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                    > 
                    {HIVE_TYPES.map(type =>(
                        <option 
                            key={type.value}
                            value={type.value}>
                            {type.label}
                        </option>
                    ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de cadres</label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        name="framecount"
                        value={formData.framecount}
                        onChange={handleChange}
                    > 
                    {FRAME_COUNTS.map(type =>(
                        <option 
                            key={type.value}
                            value={type.value}>
                            {type.label}
                        </option>
                    ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    > 
                    {HIVE_STATUS.map(status =>(
                        <option 
                            key={status.value}
                            value={status.value}>
                            {status.label}
                        </option>
                    ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
                    <input 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        type="text"
                        name="color"
                        value={formData.color}
                        placeholder="ex: Bleue, Rouge, Naturelle"
                        onChange={handleChange} 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Année de fabrication</label>
                    <input 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        type="text"
                        name="yearBuilt"
                        value={formData.yearBuilt}
                        placeholder="ex: 2024"
                        onChange={handleChange} 
                    />
                </div>
                <input 
                    type="submit" 
                    value="Ajouter ruche"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer font-medium"
                />
            </form>
        </div>
    </div>
  );

}
export default NewHive;
