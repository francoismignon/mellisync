import axios from "../config/axiosConfig";
import { useEffect, useState } from "react";
import{ HIVE_TYPES, FRAME_COUNTS, HIVE_STATUS, TRANSHUMANCE_REASONS} from "../constants/index";
import { useNavigate, useParams } from "react-router";
import Toast from "../components/Toast";

function Hive(){
    const [hive, setHive] = useState<any>({});
    const [visits, setVisits] = useState<any[]>([]);
    const [transhumances, setTranshumances] = useState<any[]>([]);
    const [apiaries, setApiaries] = useState<any[]>([]);
    const [showMoveModal, setShowMoveModal] = useState(false);
    const [selectedApiaryId, setSelectedApiaryId] = useState<string>("");
    const [reason, setReason] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const [isMoving, setIsMoving] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [statusNote, setStatusNote] = useState<string>("");
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [toast, setToast] = useState({ message: "", type: "success" as "success" | "error", isVisible: false });
    const params = useParams();
    const navigate = useNavigate();

    async function fetchHive(){
        try {
            const hiveId = params['hive-id'];
            const response = await axios.get(`/api/hives/${hiveId}`);
            setHive(response.data);

        } catch (error) {
            console.log(error);
        }
    }

    //Fonction pour récupérer les visites de cette ruche
    async function fetchVisits(){
        try {
            const hiveId = params['hive-id'];
            const response = await axios.get(`/api/hives/${hiveId}/visits`);
            setVisits(response.data);
        } catch (error) {
            console.log("Erreur récupération visites:", error);
        }
    }

    //Fonction pour récupérer l'historique des transhumances
    async function fetchTranshumances(){
        try {
            const hiveId = params['hive-id'];
            const response = await axios.get(`/api/hives/${hiveId}/transhumances`);
            setTranshumances(response.data);
        } catch (error) {
            console.log("Erreur récupération transhumances:", error);
        }
    }

    //Fonction pour récupérer tous les ruchers de l'utilisateur
    async function fetchApiaries(){
        try {
            const response = await axios.get('/api/apiaries');
            setApiaries(response.data);
        } catch (error) {
            console.log("Erreur récupération ruchers:", error);
        }
    }

    useEffect(()=>{
        fetchHive();
        fetchVisits();
        fetchTranshumances();
        fetchApiaries();
    }, []);

    //Fonction pour déplacer la ruche
    async function moveHive() {
        if (!selectedApiaryId || !reason) {
            setToast({ message: "Veuillez sélectionner un rucher et une raison", type: "error", isVisible: true });
            return;
        }

        setIsMoving(true);
        try {
            const hiveId = params['hive-id'];
            const response = await axios.post(`/api/hives/${hiveId}/move`, {
                newApiaryId: parseInt(selectedApiaryId),
                reason: reason,
                note: note || undefined
            });

            setToast({ message: "Ruche déplacée avec succès", type: "success", isVisible: true });
            
            // Fermer le modal et reset les états
            setShowMoveModal(false);
            setSelectedApiaryId("");
            setReason("");
            setNote("");
            
            // Recharger les données
            fetchTranshumances();
            
        } catch (error: any) {
            console.error("Erreur déplacement ruche:", error);
            setToast({ message: "Erreur lors du déplacement", type: "error", isVisible: true });
        } finally {
            setIsMoving(false);
        }
    }

    // Fonction pour modifier le statut de la ruche
    async function updateHiveStatus() {
        if (!selectedStatus) {
            setToast({ message: "Veuillez sélectionner un statut", type: "error", isVisible: true });
            return;
        }

        setIsUpdatingStatus(true);
        try {
            const hiveId = params['hive-id'];
            const response = await axios.put(`/api/hives/${hiveId}/status`, {
                newStatus: selectedStatus,
                note: statusNote || undefined
            });

            setToast({ message: "Statut modifié avec succès", type: "success", isVisible: true });
            
            // Fermer le modal et reset les états
            setShowStatusModal(false);
            setSelectedStatus("");
            setStatusNote("");
            
            // Recharger les données de la ruche
            fetchHive();
            
        } catch (error: any) {
            console.error("Erreur modification statut:", error);
            setToast({ message: "Erreur lors de la modification", type: "error", isVisible: true });
        } finally {
            setIsUpdatingStatus(false);
        }
    }

    return(
        <div>
            <Toast 
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast({ ...toast, isVisible: false })}
            />
            <h1>{hive.name}</h1>
            <h1>{hive.color}</h1>
            {/* On utilise une IIFE (Immediately Invoked Function Expression) pour exécuter du code inline.
            On cherche le bon type avec .find() dans HIVE_TYPES, puis on affiche son label
            (via opérateur ternaire ou short-circuit pour éviter une erreur si non trouvé). */}
            <h1>
                {
                    (()=>{
                        const objt = HIVE_TYPES.find(type => type.value === hive.type); 
                        return objt && objt.label;
                    })()
                }
            </h1>
            {/* On utilise .find() pour récupérer l’objet correspondant, et ?. (optional chaining) pour afficher son label uniquement s’il existe. */}
            <h1>{FRAME_COUNTS.find(frame => frame.value === hive.framecount)?.label}</h1>
            <h1>{HIVE_STATUS.find(status => status.value === hive.status)?.label}</h1>
            <div className="flex gap-4 mb-6">
                <input 
                    type="button" 
                    value="Ajouter une visite"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    onClick={()=> {
                        navigate(`/ruchers/${params['apiary-id']}/ruches/${params['hive-id']}/visites/nouvelle`);
                    }} />
                
                <input 
                    type="button" 
                    value="Déplacer ruche"
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
                    onClick={() => setShowMoveModal(true)} 
                />

                <input 
                    type="button" 
                    value="Modifier statut"
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
                    onClick={() => setShowStatusModal(true)} 
                />
            </div>

            {/*Section Historique des visites */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Historique des visites</h2>
                
                {visits.length === 0 ? (
                    <p className="text-gray-500 italic">Aucune visite enregistrée pour cette ruche</p>
                ) : (
                    <div className="space-y-2">
                        {visits.map(visit => {
                            //Fonction pour formater la date
                            const formatDate = (dateString: string) => {
                                const date = new Date(dateString);
                                return date.toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                });
                            };

                            return (
                                <div 
                                    key={visit.id}
                                    onClick={() => {
                                        //Téléchargement PDF fiche de visite
                                        window.open(`${import.meta.env.VITE_API_BASE_URL}/api/visits/${visit.id}/pdf`, '_blank');
                                    }}
                                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:bg-gray-50 cursor-pointer transition-all"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-gray-800">{formatDate(visit.date)}</p>
                                            <p className="text-sm text-gray-600">
                                                {visit.visitActions?.length || 0} action(s) effectuée(s)
                                            </p>
                                        </div>
                                        <div className="text-blue-500 font-bold">
                                            PDF
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/*Section Historique des transhumances */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Historique des transhumances</h2>
                
                {transhumances.length === 0 ? (
                    <p className="text-gray-500 italic">Aucune transhumance enregistrée pour cette ruche</p>
                ) : (
                    <div className="space-y-2">
                        {transhumances.map(transhumance => {
                            //Fonction pour formater la date
                            const formatDate = (dateString: string) => {
                                const date = new Date(dateString);
                                return date.toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                });
                            };

                            // Trouver le label de la raison
                            const reasonLabel = TRANSHUMANCE_REASONS.find(
                                reason => reason.value === transhumance.reason
                            )?.label || transhumance.reason;

                            // Calculer durée si endDate existe
                            const duration = transhumance.endDate 
                                ? ` → ${formatDate(transhumance.endDate)}`
                                : ' → Actuel';

                            return (
                                <div 
                                    key={transhumance.id}
                                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {transhumance.apiary.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {transhumance.apiary.address}, {transhumance.apiary.city}
                                            </p>
                                            <p className="text-sm text-blue-600 font-medium mt-1">
                                                {reasonLabel}
                                            </p>
                                            {transhumance.note && (
                                                <p className="text-sm text-gray-500 mt-1 italic">
                                                    {transhumance.note}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right text-sm text-gray-500">
                                            <p>{formatDate(transhumance.startDate)}{duration}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal déplacement ruche */}
            {showMoveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-bold mb-4">Déplacer la ruche</h3>
                        
                        {/* Sélection rucher de destination */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rucher de destination
                            </label>
                            <select 
                                value={selectedApiaryId}
                                onChange={(e) => setSelectedApiaryId(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Sélectionner un rucher...</option>
                                {apiaries
                                    .filter(apiary => apiary.id !== parseInt(params['apiary-id']!))
                                    .map(apiary => (
                                        <option key={apiary.id} value={apiary.id}>
                                            {apiary.name} - {apiary.city}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        {/* Raison du déplacement */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Raison du déplacement
                            </label>
                            <select 
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Sélectionner une raison...</option>
                                {TRANSHUMANCE_REASONS.map(reasonOption => (
                                    <option key={reasonOption.value} value={reasonOption.value}>
                                        {reasonOption.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Note optionnelle */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Note (optionnelle)
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Ajoutez une note..."
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                            />
                        </div>

                        {/* Boutons */}
                        <div className="flex gap-3 justify-end">
                            <button 
                                onClick={() => {
                                    setShowMoveModal(false);
                                    setSelectedApiaryId("");
                                    setReason("");
                                    setNote("");
                                }}
                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                                disabled={isMoving}
                            >
                                Annuler
                            </button>
                            <button 
                                onClick={moveHive}
                                disabled={isMoving || !selectedApiaryId || !reason}
                                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-400 transition-colors flex items-center gap-2"
                            >
                                {isMoving && (
                                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                )}
                                {isMoving ? 'Déplacement...' : 'Déplacer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal modification statut */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-bold mb-4">Modifier le statut de la ruche</h3>
                        
                        {/* Sélection du nouveau statut */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nouveau statut
                            </label>
                            <select 
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">Sélectionner un statut...</option>
                                {HIVE_STATUS.map(status => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Note optionnelle */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Note (optionnelle)
                            </label>
                            <textarea
                                value={statusNote}
                                onChange={(e) => setStatusNote(e.target.value)}
                                placeholder="Raison du changement de statut..."
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                rows={3}
                            />
                        </div>

                        {/* Boutons */}
                        <div className="flex gap-3 justify-end">
                            <button 
                                onClick={() => {
                                    setShowStatusModal(false);
                                    setSelectedStatus("");
                                    setStatusNote("");
                                }}
                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                                disabled={isUpdatingStatus}
                            >
                                Annuler
                            </button>
                            <button 
                                onClick={updateHiveStatus}
                                disabled={isUpdatingStatus || !selectedStatus}
                                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400 transition-colors flex items-center gap-2"
                            >
                                {isUpdatingStatus && (
                                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                )}
                                {isUpdatingStatus ? 'Modification...' : 'Modifier'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Hive;