import axios from "../config/axiosConfig";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function Dashboard(){
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
                <h2 className="text-xl font-bold mb-4">Statistiques</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Carte Ruchers */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-600">{dashboardData?.statistics?.apiaryCount || 0}</div>
                        <div className="text-sm text-blue-800">Ruchers</div>
                    </div>

                    {/* Carte Ruches enrichie avec répartition */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-600 mb-2">{dashboardData?.statistics?.totalHives || 0}</div>
                        <div className="text-sm text-green-800 mb-3">Ruches totales</div>
                        
                        {dashboardData?.statistics?.hivesByStatus && Object.keys(dashboardData.statistics.hivesByStatus).length > 0 && (
                            <div className="space-y-1">
                                {Object.entries(dashboardData.statistics.hivesByStatus).map(([status, count]: [string, any]) => {
                                    // Mapping des statuts avec icônes et traductions
                                    const statusMapping: Record<string, {icon: string, label: string}> = {
                                        'ACTIVE': { icon: '✅', label: 'actives' },
                                        'WINTERING': { icon: '🥶', label: 'hivernage' },
                                        'DEAD': { icon: '☠️', label: 'mortes' },
                                        'INACTIVE': { icon: '🚫', label: 'inactives' },
                                        'EMPTY': { icon: '📦', label: 'vides' },
                                        'QUARANTINE': { icon: '🏥', label: 'quarantaine' },
                                        'SWARMED': { icon: '🐝', label: 'essaimées' },
                                        'MAINTENANCE': { icon: '🔧', label: 'maintenance' }
                                    };
                                    
                                    const statusInfo = statusMapping[status] || { icon: '❓', label: status.toLowerCase() };
                                    
                                    return (
                                        <div key={status} className="flex items-center justify-between text-xs text-green-700">
                                            <span>{statusInfo.icon} {count} {statusInfo.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Carte Visites */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-600">{dashboardData?.statistics?.visitsThisMonth || 0}</div>
                        <div className="text-sm text-purple-800">Visites ce mois</div>
                    </div>
                </div>
            </div>


            {/* Alertes */}
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Alertes</h2>
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
                                    onClick={() => navigate(`/ruchers/${hive.apiaryId}/ruches/${hive.id}`)}
                                    className="bg-white rounded p-3 border border-red-100 hover:bg-red-50 hover:border-red-200 cursor-pointer transition-colors"
                                >
                                    <div className="font-medium text-red-900">{hive.name}</div>
                                    <div className="text-sm text-red-700">
                                        {hive.apiary.name} ({hive.apiary.city}) • 
                                        {hive.daysSinceLastVisit 
                                            ? ` ${hive.daysSinceLastVisit} jours depuis dernière visite`
                                            : ' Aucune visite enregistrée'
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
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-green-800">Toutes vos ruches ont été visitées récemment</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )

}
export default Dashboard;