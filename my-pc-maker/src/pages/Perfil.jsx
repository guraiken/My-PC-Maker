import Modal from "../components/Modal"
import Navbar from "../components/Navbar"
import SeletorCondicional from "../components/SeletorCondicional"
import { GlobalContext } from "../contexts/globalContext"
import "./Perfil.css"
import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'

function Perfil() {
  const {usuarioLogado, setUsuarioLogado, isOpen, setIsOpen} = useContext(GlobalContext)

  const navegar = useNavigate()

  return (
    <section className="perfil-container">
      <Navbar/>
      <Modal>
        <h1>TESTE</h1>
      </Modal>

      <div className="perfil-area">

        <div className="user-bio">
          <div className="user-img">
            <img src="https://img.icons8.com/plasticine/1200/user-male-circle.jpg" alt="" width={"40%"}/>
          </div>
          <div className="user-biodesc">
            <h1>teste</h1>
            <p>teste</p>
          </div>
        </div>

        <div className="user-stats">
          <div className="upper-div">
            <div className="user-builds-container">
              <div className="user-builds">
                <div className="build-icon">
                  <img src="./public/svgs/pc-icon.svg" alt="" width={'40%'} />
                </div>
                <div className="build-stats">
                  <h1>Builds</h1>
                  <span>0</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lower-div">
            <div className="user-buttons">
              <button className="button-editar" onClick={() => setIsOpen(true)}>Editar Conta</button>
              <button className="button-sair" onClick={() => setUsuarioLogado(null)}>Sair</button>
            </div>
          </div>
        </div>

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