import "./Navbar.css"


function Navbar() {
  return (
    <header className="navbar">
    <div className="logo">
        <span>My PC Maker</span>
    </div>
    <nav className="nav-links">
        <a href="#">Testar Build</a>
        <a href="#">Feed</a>
        <a href="#">Perfil</a>
    </nav>
    </header>
  )
}

export default Navbar