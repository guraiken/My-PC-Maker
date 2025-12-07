import { Link } from "react-router-dom"
import "./Navbar.css"
import { div, section } from "framer-motion/client"


function Navbar() {
  return (
    <header className="navbar">
    <div className="logo">
        <img src="./svgs/logo-mpcm-flat.svg" alt="" width={"30%"}/>
        <span>My PC Maker</span>
    </div>
    <nav className="nav-links">
        
        <Link to={"/montagem"}>Montar PC</Link>
        <Link to={"/perfil"}>Perfil</Link>
    </nav>
    </header>
  )
}

export default Navbar