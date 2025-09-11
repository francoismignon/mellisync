import axios from "../config/axiosConfig";
import { useEffect, useState } from "react";
import{ HIVE_TYPES, FRAME_COUNTS, HIVE_STATUS, TRANSHUMANCE_REASONS} from "../constants/index";
import { useNavigate, useParams } from "react-router";
import Toast from "../components/Toast";
import { Hive as HiveIcon, ArrowBack, Add, SwapHoriz, Edit, QrCodeScanner, Print, Close, Circle, PictureAsPdf, LocationOn, Cancel, Save } from "@mui/icons-material";
import { IconButton } from "@mui/material";

// Types TypeScript
interface HiveType {
    id: number;
    name: string;
    type: string;
    framecount: string;
    status: string;
    color: string;
    yearBuilt: string;
    qrCodeDataUrl?: string;
    statusReason?: string;
    statusChangedAt?: string;
}

interface VisitType {
    id: number;
    createdAt: string;
    date: string;
    visitActions: Record<string, unknown>;
}

interface TranshumanceType {
    id: number;
    fromApiaryId: number;
    toApiaryId: number;
    reason: string;
    note: string;
    createdAt: string;
    startDate: string;
    endDate: string;
    fromApiary: ApiaryType;
    toApiary: ApiaryType;
    apiary?: ApiaryType;
}

interface ApiaryType {
    id: number;
    name: string;
    address: string;
    city: string;
}

function Hive(){
    const [hive, setHive] = useState<HiveType>({} as HiveType);
    const [visits, setVisits] = useState<VisitType[]>([]);
    const [transhumances, setTranshumances] = useState<TranshumanceType[]>([]);
    const [apiaries, setApiaries] = useState<ApiaryType[]>([]);
    const [showMoveModal, setShowMoveModal] = useState(false);
    const [selectedApiaryId, setSelectedApiaryId] = useState<string>("");
    const [reason, setReason] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const [isMoving, setIsMoving] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [statusNote, setStatusNote] = useState<string>("");
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [isGeneratingQR, setIsGeneratingQR] = useState(false);
    const [showFABMenu, setShowFABMenu] = useState(false);
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
            await axios.post(`/api/hives/${hiveId}/move`, {
                newApiaryId: parseInt(selectedApiaryId),
                reason: reason,
                note: note || undefined
            });

            setToast({ message: "Ruche déplacée avec succès", type: "success", isVisible: true });
            
            // Fermer le modal et reset les états
            setShowMoveModal(false);
            const newApiaryId = selectedApiaryId;
            setSelectedApiaryId("");
            setReason("");
            setNote("");
            
            // Rediriger vers le nouveau rucher après délai pour voir le toast
            setTimeout(() => {
                navigate(`/ruchers/${newApiaryId}/ruches/${hiveId}`);
            }, 1500);
            
        } catch (error: unknown) {
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
            await axios.put(`/api/hives/${hiveId}/status`, {
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
            
        } catch (error: unknown) {
            console.error("Erreur modification statut:", error);
            setToast({ message: "Erreur lors de la modification", type: "error", isVisible: true });
        } finally {
            setIsUpdatingStatus(false);
        }
    }

    function handlePrintQR() {
        const printWindow = window.open('', '_blank');
        if (printWindow && hive?.qrCodeDataUrl) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>QR Code - ${hive.name}</title>
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
                            <div class="qr-title">Ruche: ${hive.name}</div>
                            <div class="qr-code">
                                <img src="${hive.qrCodeDataUrl}" alt="QR Code ${hive.name}" />
                            </div>
                            <div class="qr-info">
                                Scanner pour accéder à la ruche<br/>
                                Type: ${hive.type} - Couleur: ${hive.color}
                            </div>
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    }

    async function handleGenerateQR() {
        if (!hive) return;
        
        setIsGeneratingQR(true);
        try {
            const response = await axios.post(`/api/hives/${hive.id}/generate-qr`);
            
            // Mettre à jour les données de la ruche avec le nouveau QR code
            setHive(response.data.hive);
            setToast({ message: "QR Code généré avec succès", type: "success", isVisible: true });
            
            // Afficher automatiquement le modal QR
            setShowQRModal(true);
        } catch (error: unknown) {
            console.error("Erreur génération QR:", error);
            setToast({ message: "Erreur lors de la génération", type: "error", isVisible: true });
        } finally {
            setIsGeneratingQR(false);
        }
    }

    return(
        <div className="max-w-4xl mx-auto">
            <Toast 
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast({ ...toast, isVisible: false })}
            />
            
            {/* Header avec retour */}
            <div className="flex items-center gap-3 mb-6">
                <IconButton
                    onClick={() => navigate(`/ruchers/${params['apiary-id']}`)}
                    className="text-gray-600 hover:text-blue-600"
                    size="small"
                >
                    <ArrowBack />
                </IconButton>
                <HiveIcon className="text-blue-600" fontSize="large" />
                <h1 className="text-2xl font-semibold text-gray-800">{hive.name || 'Ruche'}</h1>
            </div>
            
            {/* Informations de la ruche */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <HiveIcon className="text-blue-600" fontSize="small" />
                    Informations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-gray-600">Type :</span>
                        <span className="text-gray-800 font-medium">{HIVE_TYPES.find(type => type.value === hive.type)?.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-600">Cadres :</span>
                        <span className="text-gray-800 font-medium">{FRAME_COUNTS.find(frame => frame.value === hive.framecount)?.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-600">Couleur :</span>
                        {hive.color && (
                            <div 
                                className="w-5 h-5 rounded-full border border-gray-300"
                                style={{ backgroundColor: hive.color }}
                                title={hive.color}
                            ></div>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-600">Année :</span>
                        <span className="text-gray-800 font-medium">{hive.yearBuilt}</span>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-gray-600">Statut :</span>
                            <span className={`flex items-center gap-2 font-medium ${
                                hive.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-500'
                            }`}>
                                <Circle fontSize="small" />
                                {HIVE_STATUS.find(status => status.value === hive.status)?.label}
                            </span>
                        </div>
                        {hive.statusReason && (
                            <div className="text-sm text-gray-500 ml-6">
                                Raison : {hive.statusReason}
                            </div>
                        )}
                        {hive.statusChangedAt && (
                            <div className="text-xs text-gray-400 ml-6">
                                Modifié le {new Date(hive.statusChangedAt).toLocaleDateString('fr-FR')}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Boutons d'action desktop */}
            <div className="hidden sm:flex sm:flex-row gap-3 mb-6">
                <button 
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    onClick={()=> {
                        navigate(`/ruchers/${params['apiary-id']}/ruches/${params['hive-id']}/visites/nouvelle`);
                    }}
                >
                    <Add fontSize="small" />
                    Ajouter une visite
                </button>
                
                <button 
                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                    onClick={() => setShowMoveModal(true)} 
                >
                    <SwapHoriz fontSize="small" />
                    Déplacer ruche
                </button>

                <button 
                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                    onClick={() => setShowStatusModal(true)} 
                >
                    <Edit fontSize="small" />
                    Modifier statut
                </button>

                <button 
                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                    onClick={() => setShowQRModal(true)}
                >
                    <QrCodeScanner fontSize="small" />
                    QR Code
                </button>
            </div>

            {/* Historique des visites */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <PictureAsPdf className="text-blue-600" fontSize="small" />
                    Historique des visites ({visits.length})
                </h2>
                
                {visits.length === 0 ? (
                    <div className="text-center py-8">
                        <PictureAsPdf className="text-gray-400 mb-2" fontSize="large" />
                        <p className="text-gray-500">Aucune visite enregistrée</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {visits.map(visit => {
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
                                        window.open(`${import.meta.env.VITE_API_BASE_URL}/api/visits/${visit.id}/pdf`, '_blank');
                                    }}
                                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <PictureAsPdf className="text-blue-600" fontSize="small" />
                                            <div>
                                                <p className="font-semibold text-gray-800">{formatDate(visit.date)}</p>
                                                <p className="text-sm text-gray-600">
                                                    {Object.keys(visit.visitActions || {}).length} action(s) effectuée(s)
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-blue-600 text-sm font-medium">Télécharger PDF</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Historique des transhumances */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <SwapHoriz className="text-blue-600" fontSize="small" />
                    Historique des transhumances ({transhumances.length})
                </h2>
                
                {transhumances.length === 0 ? (
                    <div className="text-center py-8">
                        <SwapHoriz className="text-gray-400 mb-2" fontSize="large" />
                        <p className="text-gray-500">Aucune transhumance enregistrée</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {transhumances.map(transhumance => {
                            const formatDate = (dateString: string) => {
                                const date = new Date(dateString);
                                return date.toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                });
                            };

                            const reasonLabel = TRANSHUMANCE_REASONS.find(
                                reason => reason.value === transhumance.reason
                            )?.label || transhumance.reason;


                            return (
                                <div 
                                    key={transhumance.id}
                                    className="border border-gray-200 rounded-lg p-4"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-start gap-3 flex-1">
                                            <LocationOn className="text-blue-600 mt-0.5" fontSize="small" />
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-800">
                                                    {transhumance.apiary?.name || 'Rucher inconnu'}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {transhumance.apiary?.address || 'Adresse inconnue'}, {transhumance.apiary?.city || 'Ville inconnue'}
                                                </p>
                                                <p className="text-sm text-blue-600 font-medium mt-1">
                                                    {reasonLabel}
                                                </p>
                                                {transhumance.note && (
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {transhumance.note}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right text-sm text-gray-500 ml-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-800 font-medium">{formatDate(transhumance.startDate)}</span>
                                                <span className="text-gray-400">→</span>
                                                <span className={
                                                    transhumance.endDate 
                                                        ? "text-gray-800 font-medium" 
                                                        : "text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded text-xs"
                                                }>
                                                    {transhumance.endDate ? formatDate(transhumance.endDate) : 'Actuel'}
                                                </span>
                                            </div>
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
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white border border-gray-200 rounded-lg max-w-md w-full p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <SwapHoriz className="text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Déplacer la ruche</h3>
                        </div>
                        
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
                        <div className="flex gap-3">
                            <button 
                                onClick={() => {
                                    setShowMoveModal(false);
                                    setSelectedApiaryId("");
                                    setReason("");
                                    setNote("");
                                }}
                                className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg flex-1"
                                disabled={isMoving}
                            >
                                <Cancel fontSize="small" />
                                Annuler
                            </button>
                            <button 
                                onClick={moveHive}
                                disabled={isMoving || !selectedApiaryId || !reason}
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg disabled:bg-gray-400 flex-1"
                            >
                                {isMoving ? (
                                    <>
                                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                        Déplacement...
                                    </>
                                ) : (
                                    <>
                                        <SwapHoriz fontSize="small" />
                                        Déplacer
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal modification statut */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white border border-gray-200 rounded-lg max-w-md w-full p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <Edit className="text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Modifier le statut</h3>
                        </div>
                        
                        {/* Sélection du nouveau statut */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nouveau statut
                            </label>
                            <select 
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                            />
                        </div>

                        {/* Boutons */}
                        <div className="flex gap-3">
                            <button 
                                onClick={() => {
                                    setShowStatusModal(false);
                                    setSelectedStatus("");
                                    setStatusNote("");
                                }}
                                className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg flex-1"
                                disabled={isUpdatingStatus}
                            >
                                <Cancel fontSize="small" />
                                Annuler
                            </button>
                            <button 
                                onClick={updateHiveStatus}
                                disabled={isUpdatingStatus || !selectedStatus}
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg disabled:bg-gray-400 flex-1"
                            >
                                {isUpdatingStatus ? (
                                    <>
                                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                        Modification...
                                    </>
                                ) : (
                                    <>
                                        <Save fontSize="small" />
                                        Modifier
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal QR Code */}
            {showQRModal && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md w-full shadow-lg">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <QrCodeScanner className="text-blue-600" />
                            <h2 className="text-lg font-semibold text-gray-800">
                                QR Code - {hive.name}
                            </h2>
                        </div>
                        
                        <div className="text-center mb-6">
                            {hive?.qrCodeDataUrl ? (
                                <>
                                    <img 
                                        src={hive.qrCodeDataUrl} 
                                        alt={`QR Code pour ${hive.name}`}
                                        className="mx-auto mb-4"
                                    />
                                    <p className="text-gray-600 text-sm">
                                        Scanner ce code QR pour accéder directement à cette ruche.<br/>
                                        Vous pouvez le réimprimer si nécessaire.
                                    </p>
                                </>
                            ) : (
                                <div className="py-8">
                                    <p className="text-gray-500 text-center">
                                        Aucun QR code généré pour cette ruche.<br/>
                                        Cliquez sur "Régénérer QR Code" pour en créer un.
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            {hive?.qrCodeDataUrl && (
                                <button
                                    onClick={handlePrintQR}
                                    className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                                >
                                    <Print fontSize="small" />
                                    Imprimer QR Code
                                </button>
                            )}
                            
                            <button
                                onClick={handleGenerateQR}
                                disabled={isGeneratingQR}
                                className="flex items-center justify-center gap-2 w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg disabled:bg-gray-400"
                            >
                                <QrCodeScanner fontSize="small" />
                                {isGeneratingQR ? "Génération..." : (hive?.qrCodeDataUrl ? "Régénérer QR Code" : "Générer QR Code")}
                            </button>
                            
                            <button
                                onClick={() => setShowQRModal(false)}
                                className="flex items-center justify-center gap-2 w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                            >
                                <Close fontSize="small" />
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FAB Mobile uniquement - caché si modale ouverte */}
            {!showMoveModal && !showStatusModal && !showQRModal && (
                <div className="sm:hidden fixed bottom-6 right-6 z-50">
                {/* Menu FAB (affiché si ouvert) */}
                {showFABMenu && (
                    <div className="absolute bottom-16 right-0 flex flex-col gap-3 mb-2">
                        {/* Bouton Ajouter visite */}
                        <div className="flex items-center gap-3">
                            <span className="bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded whitespace-nowrap">
                                Ajouter visite
                            </span>
                            <button
                                onClick={() => {
                                    setShowFABMenu(false);
                                    navigate(`/ruchers/${params['apiary-id']}/ruches/${params['hive-id']}/visites/nouvelle`);
                                }}
                                className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center"
                            >
                                <Add className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Bouton Déplacer */}
                        <div className="flex items-center gap-3">
                            <span className="bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded whitespace-nowrap">
                                Déplacer ruche
                            </span>
                            <button
                                onClick={() => {
                                    setShowFABMenu(false);
                                    setShowMoveModal(true);
                                }}
                                className="w-12 h-12 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center"
                            >
                                <SwapHoriz className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Bouton Modifier statut */}
                        <div className="flex items-center gap-3">
                            <span className="bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded whitespace-nowrap">
                                Modifier statut
                            </span>
                            <button
                                onClick={() => {
                                    setShowFABMenu(false);
                                    setShowStatusModal(true);
                                }}
                                className="w-12 h-12 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center"
                            >
                                <Edit className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Bouton QR Code */}
                        <div className="flex items-center gap-3">
                            <span className="bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded whitespace-nowrap">
                                QR Code
                            </span>
                            <button
                                onClick={() => {
                                    setShowFABMenu(false);
                                    setShowQRModal(true);
                                }}
                                className="w-12 h-12 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center"
                            >
                                <QrCodeScanner className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Bouton FAB principal */}
                <button
                    onClick={() => setShowFABMenu(!showFABMenu)}
                    className={`w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center ${showFABMenu ? 'rotate-45' : ''}`}
                >
                    <Add className="w-6 h-6" />
                </button>
                </div>
            )}
        </div>
    );
}
export default Hive;