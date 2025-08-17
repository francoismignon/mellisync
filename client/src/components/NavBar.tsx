import { Link } from "react-router"

function NavBar(){
    return(
        <nav className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <h1 className="text-xl font-semibold text-gray-800">Mellisync</h1>
                    <div className="flex gap-6">
                        <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                            Tableau de bord
                        </Link>
                        <Link to="/ruchers" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                            Ruchers
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )

}
export default NavBar