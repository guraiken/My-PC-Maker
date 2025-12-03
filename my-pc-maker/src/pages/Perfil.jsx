import Modal from "../components/Modal"
import Navbar from "../components/Navbar"
import SeletorCondicional from "../components/SeletorCondicional"
import { GlobalContext } from "../contexts/globalContext"
import "./Perfil.css"
import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import axios from "axios"

function Perfil() {
  const {usuarioLogado, setUsuarioLogado, isOpen, setIsOpen} = useContext(GlobalContext)
    const [nomeInput, setNomeInput] = useState(usuarioLogado.nome)
    const [emailInput, setEmailInput] = useState(usuarioLogado.email)
    const [senhaInput, setSenhaInput] = useState()

  const navegar = useNavigate()

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(`https://my-pc-maker-cq8f.vercel.app/usuario/${usuarioLogado.id_usuario}`);
      setUsuarioLogado(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  }

    const limparForm = () => {
      setNomeInput('')
      setEmailInput('')
      setSenhaInput('')
    }

    const editarUsuario = async (e) => {
      e.preventDefault()
      try {
        const usuario = {
          nome: nomeInput,
          email: emailInput,
        };
        if (senhaInput) {
          usuario.senha = senhaInput;
        }

        console.log("ENVIANDO:", usuario);
        const response = await axios.put(`https://my-pc-maker-cq8f.vercel.app/usuario/${usuarioLogado.id_usuario}`, usuario);

        if (response.status === 200) {
          fetchUsuarios();
          setIsOpen(false)
        }
      }
      catch (error) {
        console.log(error.response?.data || error);
      }
    }

  return (
    <section className="perfil-container">
      <Navbar/>

      <Modal width={"35%"} height={"80%"}>
        <div className="perfil-edit">
          <h1>Editar Perfil</h1>
          <form onSubmit={(e) => editarUsuario(e)}>
            <label>Nome:</label>
            <input type="text" placeholder={nomeInput}
            value={nomeInput} onChange={(e) => setNomeInput(e.target.value)}
            />
            <label>Email:</label>
            <input type="text" placeholder={emailInput}
            value={emailInput} onChange={(e) => setEmailInput(e.target.value)}
            />
            <label>Senha:</label>
            <input type="password" placeholder="********"
            value={senhaInput} onChange={(e) => setSenhaInput(e.target.value)}
            />
            <div className="perfil-edit-buttons">
              <button type="submit" className="button-salvar">Salvar</button>
              <button type="button" className="button-cancelar" onClick={() => setIsOpen(false)}>Cancelar</button>
            </div>
          </form>
        </div>
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
                  <img src="./svgs/pc-icon.svg" alt="" width={'40%'} />
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