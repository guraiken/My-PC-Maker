import { Link } from "react-router-dom"
import "./Navbar.css"
import { div, section } from "framer-motion/client"


function Navbar() {
  return (
    <header className="navbar">
    <div className="logo">
        <span>My PC Maker</span>
    </div>
    <nav className="nav-links">
        
        <a href="#">Feed</a>
        <Link to={"/perfil"}>Perfil</Link>
    </nav>
    </header>
  )
}

export default Navbar