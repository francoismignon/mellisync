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
    const [showQRModal, setShowQRModal] = useState(false);
    const [createdHive, setCreatedHive] = useState<any>(null);
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
      
      setCreatedHive(response.data.hive);
      setToast({ message: "Ruche créée avec succès", type: "success", isVisible: true });
      
      // Afficher le modal QR code si disponible
      if (response.data.hive.qrCodeDataUrl) {
        setShowQRModal(true);
      } else {
        // Redirection immédiate si pas de QR code
        setTimeout(() => {
          navigate(`/ruchers/${apiaryId}/ruches/${response.data.hive.id}`);
        }, 1500);
      }
      
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

  function handlePrintQR() {
    const printWindow = window.open('', '_blank');
    if (printWindow && createdHive?.qrCodeDataUrl) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${createdHive.name}</title>
            <style>
              body { margin: 0; padding: 20px; text-align: center; font-family: Arial, sans-serif; }
              .qr-container { page-break-inside: avoid; }
              .qr-title { margin-bottom: 10px; font-size: 18px; font-weight: bold; }
              .qr-code { margin: 20px 0; }
              .qr-info { margin-top: 10px; font-size: 14px; color: #666; }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <div class="qr-title">Ruche: ${createdHive.name}</div>
              <div class="qr-code">
                <img src="${createdHive.qrCodeDataUrl}" alt="QR Code ${createdHive.name}" />
              </div>
              <div class="qr-info">
                Scanner pour accéder à la ruche<br/>
                Type: ${createdHive.type} - Couleur: ${createdHive.color}
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }

  function handleCloseQRModal() {
    setShowQRModal(false);
    navigate(`/ruchers/${apiaryId}/ruches/${createdHive.id}`);
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

        {/* Modal QR Code */}
        {showQRModal && createdHive && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
                QR Code généré pour {createdHive.name}
              </h2>
              
              <div className="text-center mb-6">
                <img 
                  src={createdHive.qrCodeDataUrl} 
                  alt={`QR Code pour ${createdHive.name}`}
                  className="mx-auto mb-4"
                />
                <p className="text-gray-600 text-sm">
                  Imprimez ce QR code et collez-le sur votre ruche.<br/>
                  Scanner ce code vous amènera directement à cette ruche.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handlePrintQR}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Imprimer
                </button>
                <button
                  onClick={handleCloseQRModal}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Continuer
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );

}
export default NewHive;
