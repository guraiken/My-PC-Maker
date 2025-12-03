import { Link } from "react-router-dom"
import CadastroForm from "../components/CadastroForm"
import "./Cadastro.css"
import SidePanel from "../components/SidePanel"


function Cadastro() {
  return (
    <section className="cadastro-container">
        
        <SidePanel
        titulo={"BORA COMEÇAR!"}
        texto={"Monte o PC dos seus sonhos, veja quanto ele consome, seu valor e compartilhe!"}
        />

        <div className="cadastro-right">
            <div className="cadastro-middle-container">
                <div className="cadastro-middle-top">
                    <h1>My PC Maker</h1>
                </div>

                <div className="cadastro-middle-center">
                    <CadastroForm
                        titulo={"CADASTRO"}
                        usuario={"Usuário"}
                        email={"Email"}
                        senha={"Senha"}
                        nomeButton={"CADASTRAR"}
                    />
                </div>

                <div className="cadastro-middle-bottom">
                    <span>Já possui <Link to={"/"}>login</Link>?</span>
                </div>
            </div>
        </div>

    </section>
  )
}

export default Cadastro