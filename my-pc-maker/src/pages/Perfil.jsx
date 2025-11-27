import Navbar from "../components/Navbar"
import SeletorCondicional from "../components/SeletorCondicional"
import "./Perfil.css"

function Perfil() {
  return (
    <section className="perfil-container">
      <Navbar/>

      <div className="perfil-area">
        
      </div>

      <div className="perfil-second-area">

        <div className="perfil-nav">
        
        </div>
        <div className="perfil-content">
          <SeletorCondicional/>
        </div>

      </div>

    </section>
  )
}

export default Perfil