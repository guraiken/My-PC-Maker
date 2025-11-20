import { Link } from "react-router-dom"
import CadastroForm from "../components/CadastroForm"
import "./Cadastro.css"

function Cadastro() {
  return (
    <section className="cadastro-container">
        <div className="cadastro-left">
            <div className="cadastro-left-center">
                <img src="./images/logo-grande.png" alt="" width={"35%"}/>
                <div className="cadastro-left-texto">
                    <h1>BORA COMEÇAR!</h1>
                    <div className="cadastro-left-span">
                    <span>Já pensou em montar suas builds e compartilhar com os outros, para ver o que pensam?</span>
                    </div>
                </div>
            </div>

            <div className="cadastro-left-bottom">
                <img src="https://pcnetinformatica.com.br/wp-content/uploads/2023/04/produtos-pcgamers-1024x1024.png" alt="" width={"45%"}/>
            </div>

        </div>

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
                    <span>Já possui <Link to={"/login"}>login</Link>?</span>
                </div>
            </div>
        </div>

    </section>
  )
}

export default Cadastro