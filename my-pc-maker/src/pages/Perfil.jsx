import Modal from "../components/Modal"
import Navbar from "../components/Navbar"
import SeletorCondicional from "../components/SeletorCondicional"
import { GlobalContext } from "../contexts/globalContext"
import "./Perfil.css"
import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import ConfirmationAlert from "../components/Alerts/ConfirmationAlert"
import Swal from 'sweetalert2'
import { div, img, p } from "framer-motion/client"

function Perfil() {
  const {usuarioLogado, setUsuarioLogado, isOpen, setIsOpen, usuarios, setUsuarios} = useContext(GlobalContext)
    const [nomeInput, setNomeInput] = useState(usuarioLogado.nome)
    const [emailInput, setEmailInput] = useState(usuarioLogado.email)
    const [senhaInput, setSenhaInput] = useState()
    const [bioInput, setBioInput] = useState(usuarioLogado.bio ? usuarioLogado.bio : 'Escreva algo sobre você...')
    const [imagemLinkInput, setImagemLinkInput] = useState(usuarioLogado.imagem_link ? usuarioLogado.imagem_link : '')

  const navegar = useNavigate()
  
    const editarUsuario = async (e) => {
      e.preventDefault()
      const usuarioExistente = usuarios.find((user) => user.email === emailInput);


      try {
        const usuario = {
          nome: nomeInput,
          email: emailInput,
          bio: bioInput
        };

        if(!nomeInput || !emailInput){
        Swal.fire({
          title: "ERRO!",
          text: "Nome e email são obrigatórios.",
          icon: "error",
          background: "var(--fundo)",
          color: "var(--texto-principal)",
        });
        return;
      }
        if (emailInput && !emailInput.includes('@')) {
          Swal.fire({
            title: "ERRO!",
            text: "O e-mail inserido não possui um formato válido.",
            iconColor: "var(--destaque)",
            icon: "error",
            background: "var(--fundo)",
            color: "var(--texto-principal)",
            confirmButtonColor: "var(--destaque)"
          });
          return
        }
        if (usuarioExistente && usuarioExistente.id_usuario !== usuarioLogado.id_usuario) {
          Swal.fire({
            title: "ERRO!",
            text: "O e-mail inserido já está em uso por outro usuário.",
            iconColor: "var(--destaque)",
            icon: "error",
            background: "var(--fundo)",
            color: "var(--texto-principal)",
            toast: true,
            showConfirmButton: false,
            timer: 1200,
            position: 'top',
            timerProgressBar: true,
            customClass: {timerProgressBar: 'progressBar'}
          });
          return;
        }

        if (senhaInput) {
          usuario.senha = senhaInput;
        }
        if (imagemLinkInput) {
          usuario.imagem_link = imagemLinkInput;
        }

        console.log("ENVIANDO:", usuario);
        const response = await axios.put(`https://my-pc-maker-cq8f.vercel.app/usuario/${usuarioLogado.id_usuario}`, usuario);

        if (response.status === 200) {
          setUsuarioLogado(response.data)
          setIsOpen(false)
          ConfirmationAlert({
            titulo: "PERFIL ATUALIZADO COM SUCESO!",
          })
          console.log(response.data)
        } 
      }
      catch (error) {
        console.log(error.response?.data || error);
      }
    }

  const deletarUsuario = async (e) => {
    try {
      Swal.fire({
        title: "TEM CERTEZA?",
        text: "Você não vai poder reverter isso depois!",
        background: "var(--fundo)",
        color: "var(--texto-principal)",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33",
        cancelButtonColor: "var(--separacao)",
        confirmButtonText: "Sim, delete a conta!"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "DELETADA!",
            text: "Sua conta foi deletada com sucesso.",
            icon: "success"
          });
          axios.delete(`https://my-pc-maker-cq8f.vercel.app/usuario/${usuarioLogado.id_usuario}`);
          setUsuarioLogado(null)
          isOpen(false)
        }
      });
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
    }
  };

  return (
    <section className="perfil-container">
      <Navbar/>

      <Modal width={"40%"} height={"85%"} titulo={"EDITAR PERFIL"}>
        <div className="perfil-edit">
          <form onSubmit={(e) => editarUsuario(e)} className="perfil-form">

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

            <label>Imagem de Perfil:</label>
            { imagemLinkInput && <div className="user-img" style={{marginTop: "20px"}}><img src={imagemLinkInput} alt=""/></div>}
            <input type="text" placeholder="Exemplo: https://link-da-imagem.com/imagem.jpg"
            value={imagemLinkInput} onChange={(e) => setImagemLinkInput(e.target.value)}/>

            <label>Bio:</label>
            <textarea type="text" 
            value={bioInput} onChange={(e) => setBioInput(e.target.value)}
            />
            <div className="perfil-edit-buttons">
              <button type="submit" className="button-salvar">Salvar</button>
              <button type="button" className="button-cancelar" onClick={() => setIsOpen(false)}>Cancelar</button>
            </div>
              <div className="perfil-excluir-button">
              <button type="button" className="button-excluir" onClick={(e) => deletarUsuario(e)}>Excluir Conta</button>
              </div>
          </form> 
        </div>
      </Modal>

      <div className="perfil-area">

        <div className="user-bio">
          <div className="user-img">
            { usuarioLogado.imagem_link ?
              <img src={usuarioLogado.imagem_link} alt=""/>
            :
            <img src="./images/user-profile.png" alt=""/>
            }
          </div>
          <div className="user-biodesc">
            <h1>{usuarioLogado.nome}</h1>
            {usuarioLogado.bio ? <p>{usuarioLogado.bio}</p> 
            : <p>Escreva algo sobre você...</p>
            }
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
                  <h2>Builds</h2>
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