import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

function NewHive() {
    const navigate = useNavigate();
    const params = useParams();

    const apiaryId = params['apiary-id'];

    const HIVE_TYPES = [
    { value: "DADANT", label: "Dadant" },
    { value: "LANGSTROTH", label: "Langstroth" },
    { value: "WARRE", label: "Warré" },
    { value: "KENYAN", label: "Kenyane" },
    { value: "VOIRNOT", label: "Voirnot" }
  ];

const FRAME_COUNTS = [
  { value: "FRAME_8", label: "8 cadres" },
  { value: "FRAME_10", label: "10 cadres" },
  { value: "FRAME_12", label: "12 cadres" },
  { value: "FRAME_14", label: "14 cadres" },
];


const HIVE_STATUS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "EMPTY", label: "Vide" },
  { value: "WINTERING", label: "Hivernage" },
  { value: "SWARMED", label: "Essaimée" },
  { value: "DEAD", label: "Morte" },
  { value: "QUARANTINE", label: "Quarantaine" },
  { value: "MAINTENANCE", label: "Maintenance" },
];


  const [formData, setFormData] = useState({
    name: "",
    type: "DADANT",//valeur par defaut pareille que pour les enum dans mon schéma prisma
    framecount: "FRAME_10",
    status: "ACTIVE"
  });


  async function handleSubmit(event: React.FormEvent){
    event.preventDefault();
    try {
       const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/hives`,
        {
            ...formData,
            apiaryId: apiaryId
        }
      );
      navigate(`/rucher/${apiaryId}/ruche/${response.data.hive.id}`);
    } catch (error) {
        console.log(error);
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
