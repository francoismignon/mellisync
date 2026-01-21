import { Link } from "react-router"
import axios from "../config/axiosConfig"
import { Button } from "@mui/material"
import { 
  Dashboard, 
  Home, 
  Menu, 
  Close,
  ExitToApp,
  Person
} from "@mui/icons-material"
import { useState } from "react"

interface User {
  id: number;
  name: string;
  email: string;
  roleId: number;
}

interface NavBarProps {
  user: User | null;
}

function NavBar({ user }: NavBarProps){
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout');
            window.location.href = '/';
        } catch (error) {
            console.error('Erreur logout:', error);
        }
    };

    return(
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🐝</span>
                        <h1 className="text-xl font-semibold text-gray-800">François</h1>
                    </div>
                    
                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                            <Dashboard fontSize="smal
                            l" />
                            Tableau de bord
                        </Link>
                        <Link to="/ruchers" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                            <Home fontSize="small" />
                            Ruchers
                        </Link>
                        {user && (
                            <div className="flex items-center gap-2 text-gray-700 bg-gray-100 px-3 py-2 rounded-lg">
                                <Person fontSize="small" />
                                <span className="text-sm font-medium">{user.name}</span>
                            </div>
                        )}
                        <Button 
                            onClick={handleLogout} 
                            variant="outlined" 
                            size="small"
                            startIcon={<ExitToApp />}
                            className="border-gray-300 text-gray-600 hover:border-blue-600 hover:text-blue-600"
                        >
                            Déconnexion
                        </Button>
                    </div>

                    {/* Mobile User & Menu */}
                    <div className="md:hidden flex items-center gap-3">
                        {user && (
                            <div className="flex items-center gap-2 text-gray-700 bg-gray-100 px-2 py-1 rounded-lg">
                                <Person fontSize="small" />
                                <span className="text-sm font-medium">{user.name}</span>
                            </div>
                        )}
                        <button 
                            className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <Close /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200 space-y-3">
                        <Link 
                            to="/" 
                            className="flex items-center gap-3 px-2 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <Dashboard fontSize="small" />
                            Tableau de bord
                        </Link>
                        <Link 
                            to="/ruchers" 
                            className="flex items-center gap-3 px-2 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <Home fontSize="small" />
                            Ruchers
                        </Link>
                        <Button 
                            onClick={handleLogout} 
                            variant="outlined" 
                            size="small"
                            startIcon={<ExitToApp />}
                            className="w-full justify-start border-gray-300 text-gray-600 hover:border-blue-600 hover:text-blue-600"
                        >
                            Déconnexion
                        </Button>
                    </div>
                )}
            </div>
        </nav>
    )

}
export default NavBar