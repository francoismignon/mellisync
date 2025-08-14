import { Link } from "react-router"

function NavBar(){
    return(
        <nav className="flex m-2 gap-3 justify-end">
            <Link to="/">Tableau de bord</Link>
            <Link to="/ruchers">Ruchers</Link>
        </nav>
    )

}
export default NavBar