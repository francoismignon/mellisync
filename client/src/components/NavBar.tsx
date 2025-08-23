import { Link } from "react-router"
import axios from "../config/axiosConfig"
import { Button } from "@mui/material"

function NavBar(){
    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout');
            window.location.href = '/';
        } catch (error) {
            console.error('Erreur logout:', error);
        }
    };

    return(
        <nav className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <h1 className="text-xl font-semibold text-gray-800">Mellisync</h1>
                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                            Tableau de bord
                        </Link>
                        <Link to="/ruchers" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                            Ruchers
                        </Link>
                        <Button onClick={handleLogout} variant="outlined" size="small">
                            Déconnexion
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    )

}
export default NavBar