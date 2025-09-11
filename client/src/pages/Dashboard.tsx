import axios from "../config/axiosConfig";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import QRScanner from "../components/QRScanner";
import { Home, Hive, CalendarToday, QrCodeScanner } from "@mui/icons-material";

function Dashboard(){
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showQRScanner, setShowQRScanner] = useState(false);
    const navigate = useNavigate();

    const handleQRScanSuccess = (data: string) => {
        try {
            // Parser l'URL du QR code pour extraire le chemin
            const url = new URL(data);
            const path = url.pathname; // Ex: "/ruchers/123/ruches/456"
            
            // Fermer le scanner
            setShowQRScanner(false);
            
            // Naviguer vers la ruche
            navigate(path);
        } catch (error) {
            console.error('QR code invalide:', error);
            alert('QR code invalide ou non reconnu');
            setShowQRScanner(false);
        }
    };

    const handleQRScanError = (error: string) => {
        console.error('Erreur scan QR:', error);
        alert(`Erreur scan QR: ${error}`);
        setShowQRScanner(false);
    };

    async function fetchDashboardData() {
        try {
            const response = await axios.get('/api/dashboard');
            setDashboardData(response.data);
        } catch (error) {
            console.error("Erreur récupération données dashboard:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="text-center p-8">Chargement du tableau de bord...</div>;
    }

    return(
        <div>
            <h1>Tableau de bord</h1>
            
            {/* Compteurs de base */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Statistiques</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Carte Ruchers */}
                    <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-2 mb-1">
                            <Home className="text-blue-600" fontSize="small" />
                            <div className="text-lg font-semibold text-gray-800">{dashboardData?.statistics?.apiaryCount || 0}</div>
                        </div>
                        <div className="text-sm text-gray-600">Ruchers</div>
                    </div>

                    {/* Carte Ruches */}
                    <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-2 mb-1">
                            <Hive className="text-blue-600" fontSize="small" />
                            <div className="text-lg font-semibold text-gray-800">{dashboardData?.statistics?.totalHives || 0}</div>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">Ruches totales</div>
                        
                        {dashboardData?.statistics?.hivesByStatus && Object.keys(dashboardData.statistics.hivesByStatus).length > 0 && (
                            <div className="space-y-1 border-t border-gray-100 pt-2">
                                {Object.entries(dashboardData.statistics.hivesByStatus).map(([status, count]: [string, any]) => {
                                    const statusMapping: Record<string, {label: string}> = {
                                        'ACTIVE': { label: 'actives' },
                                        'INACTIVE': { label: 'inactives' }
                                    };
                                    
                                    const statusInfo = statusMapping[status] || { label: status.toLowerCase() };
                                    
                                    return (
                                        <div key={status} className="text-xs text-gray-500">
                                            {count} {statusInfo.label}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Carte Visites */}
                    <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-2 mb-1">
                            <CalendarToday className="text-blue-600" fontSize="small" />
                            <div className="text-lg font-semibold text-gray-800">{dashboardData?.statistics?.visitsThisMonth || 0}</div>
                        </div>
                        <div className="text-sm text-gray-600">Visites ce mois</div>
                    </div>
                </div>
            </div>


            {/* Alertes */}
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">🚨 Alertes</h2>
                {dashboardData?.alerts?.hivesWithoutVisit?.length > 0 ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                            <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="font-semibold text-red-800">
                                {dashboardData.alerts.hivesWithoutVisit.length} ruche(s) sans visite récente
                            </span>
                        </div>
                        <div className="space-y-2">
                            {dashboardData.alerts.hivesWithoutVisit.map((hive: any) => (
                                <div 
                                    key={hive.id} 
                                    onClick={() => navigate(`/ruchers/${hive.apiary_hives?.[0]?.apiary?.id}/ruches/${hive.id}`)}
                                    className="bg-white rounded p-3 border border-red-100 hover:bg-red-50 hover:border-red-200 cursor-pointer transition-colors"
                                >
                                    <div className="font-medium text-red-900">{hive.name}</div>
                                    <div className="text-sm text-red-700">
                                        {hive.apiary_hives?.[0]?.apiary?.name}
                                        {typeof hive.daysSinceLastVisit === 'number' && hive.daysSinceLastVisit > 0
                                            ? ` - ${hive.daysSinceLastVisit} jours depuis dernière visite`
                                            : ' - Aucune visite enregistrée'
                                        }
                                    </div>
                                    <div className="text-xs text-red-600 mt-1 opacity-75">
                                        Cliquer pour voir la ruche
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className={`rounded-lg p-4 ${
                        (dashboardData?.statistics?.totalHives || 0) === 0
                            ? 'bg-blue-50 border border-blue-200'
                            : 'bg-green-50 border border-green-200'
                    }`}>
                        <div className="flex items-center">
                            {(dashboardData?.statistics?.totalHives || 0) === 0 ? (
                                <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            <span className={
                                (dashboardData?.statistics?.totalHives || 0) === 0
                                    ? 'text-blue-800'
                                    : 'text-green-800'
                            }>
                                {(dashboardData?.statistics?.totalHives || 0) === 0
                                    ? 'Vous n\'avez pas de ruche pour le moment'
                                    : 'Toutes vos ruches ont été visitées récemment'
                                }
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* FAB Scanner QR - Mobile uniquement */}
            <div className="sm:hidden fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setShowQRScanner(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
                    title="Scanner QR Code"
                >
                    <QrCodeScanner className="h-6 w-6" />
                </button>
            </div>

            {/* Modal QR Scanner */}
            {showQRScanner && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Scanner QR Code</h3>
                            <button
                                onClick={() => setShowQRScanner(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <QRScanner 
                            onScanSuccess={handleQRScanSuccess}
                            onScanError={handleQRScanError}
                        />
                        
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowQRScanner(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

}
export default Dashboard;