import axios from "../config/axiosConfig";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { HIVE_TYPES, FRAME_COUNTS, HIVE_STATUS, HIVE_COLORS, HIVE_YEARS, FLOWER_NAMES} from "../constants/index";
import Toast from "../components/Toast";
import { Hive, Shuffle, Save, Cancel, ArrowBack, Print, Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";

interface CreatedHive {
    id: number;
    name: string;
    type: string;
    color: string;
    qrCodeDataUrl?: string;
}

function NewHive() {
    
    const navigate = useNavigate();
    const params = useParams();
    const apiaryId = params['apiary-id'];
    const [toast, setToast] = useState({ message: "", type: "success" as "success" | "error", isVisible: false });
    const [showQRModal, setShowQRModal] = useState(false);
    const [createdHive, setCreatedHive] = useState<CreatedHive | null>(null);
    const [formData, setFormData] = useState({
      name: "",
      type: "DADANT", //valeur par defaut pareille que pour les enum dans mon schéma prisma
      framecount: "FRAME_10",
      status: "ACTIVE",
      color: "#8B7355", // Couleur par défaut : Naturel
      yearBuilt: "2025", // Année par défaut : année courante
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
    navigate(`/ruchers/${apiaryId}/ruches/${createdHive?.id}`);
  }

  function generateRandomName() {
    const randomIndex = Math.floor(Math.random() * FLOWER_NAMES.length);
    const randomName = FLOWER_NAMES[randomIndex];
    setFormData(prevFormData => ({
      ...prevFormData,
      name: randomName
    }));
  }

  return (
    <div className="max-w-2xl mx-auto">
        <Toast 
            message={toast.message}
            type={toast.type}
            isVisible={toast.isVisible}
            onClose={() => setToast({ ...toast, isVisible: false })}
        />
        <div className="flex items-center gap-3 mb-6">
            <IconButton
                onClick={() => navigate(`/ruchers/${apiaryId}`)}
                className="text-gray-600 hover:text-blue-600"
                size="small"
            >
                <ArrowBack />
            </IconButton>
            <Hive className="text-blue-600" fontSize="large" />
            <h1 className="text-2xl font-semibold text-gray-800">Nouvelle ruche</h1>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Hive fontSize="small" className="text-blue-600" />
                        Nom de la ruche
                    </label>
                    <div className="flex gap-2">
                        <input 
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            type="text"
                            name="name"
                            value={formData.name}
                            placeholder="ex: Marguerite, Lavande..."
                            onChange={handleChange} 
                        />
                        <IconButton
                            type="button"
                            onClick={generateRandomName}
                            className="border border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                            title="Générer un nom aléatoire"
                            size="medium"
                        >
                            <Shuffle className="text-gray-600 hover:text-blue-600" />
                        </IconButton>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type de ruche</label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                        Couleur de la ruche
                    </label>
                    {/* Section avec fond cohérent avec l'application */}
                    <div className="bg-slate-200 rounded-lg p-6 max-w-md mx-auto">
                        <div className="grid grid-cols-7 gap-3 justify-items-center">
                            {HIVE_COLORS.map((color) => (
                                <div
                                    key={color}
                                    className="relative flex items-center justify-center"
                                    style={{
                                        width: '40px',
                                        height: '36px'
                                    }}
                                >
                                    <div
                                        onClick={() => setFormData(prev => ({ ...prev, color: color }))}
                                        className={`cursor-pointer transition-all duration-200 absolute ${
                                            formData.color === color 
                                                ? 'ring-4 ring-blue-600 ring-opacity-50 z-10' 
                                                : 'hover:ring-2 hover:ring-gray-400'
                                        }`}
                                        style={{
                                            backgroundColor: color,
                                            width: formData.color === color ? '44px' : '26px',
                                            height: formData.color === color ? '40px' : '23px',
                                            clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                        }}
                                        title={color}
                                    >
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Année de fabrication</label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        name="yearBuilt"
                        value={formData.yearBuilt}
                        onChange={handleChange}
                    > 
                    {HIVE_YEARS.map(year =>(
                        <option 
                            key={year.value}
                            value={year.value}>
                            {year.label}
                        </option>
                    ))}
                    </select>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(`/ruchers/${apiaryId}`)}
                        className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white py-2.5 px-4 rounded-lg font-medium flex-1"
                    >
                        <Cancel fontSize="small" />
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium flex-1"
                    >
                        <Save fontSize="small" />
                        Créer la ruche
                    </button>
                </div>
            </form>
        </div>

        {/* Modal QR Code */}
        {showQRModal && createdHive && (
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
                  className="flex items-center justify-center gap-2 flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                >
                  <Print fontSize="small" />
                  Imprimer
                </button>
                <button
                  onClick={handleCloseQRModal}
                  className="flex items-center justify-center gap-2 flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                >
                  <Close fontSize="small" />
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
