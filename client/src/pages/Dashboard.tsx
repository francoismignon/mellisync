function Dashboard(){
    return(
        <div>
            <h1>Tableau de bord</h1>
            
            {/* Compteurs de base */}
            <div className="mb-6">
                <h2>Statistiques</h2>
                <div className="border p-4">
                    <p>Ruchers: 12</p>
                    <p>Ruches: 45</p>
                    <p>Visites ce mois: 23</p>
                    <p>Température actuelle: 18°C</p>
                </div>
            </div>

            {/* Dernières visites simple */}
            <div className="mb-6">
                <h2>Dernières visites</h2>
                <div className="border p-4">
                    <ul>
                        <li>Ruche A1 - 22/08/2025 14:30</li>
                        <li>Ruche B3 - 21/08/2025 10:15</li>
                        <li>Ruche C2 - 20/08/2025 16:45</li>
                    </ul>
                </div>
            </div>

            {/* Alertes basiques */}
            <div className="mb-6">
                <h2>Alertes</h2>
                <div className="border p-4">
                    <p>⚠️ Ruche D1 - Pas de visite depuis 15 jours</p>
                    <p>🚨 Ruche E2 - Pas de visite depuis 21 jours</p>
                </div>
            </div>

            <div className="text-gray-500">
                Note: Données d'exemple - À connecter aux APIs
            </div>
        </div>
    )

}
export default Dashboard;