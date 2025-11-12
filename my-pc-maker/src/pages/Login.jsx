import { Link } from "react-router-dom"
import CadastroForm from "../components/CadastroForm"
import "./Login.css"

function Login() {
  return (
    <section className="login-container">

        <div className="login-right">
            <div className="login-middle-container">
                <div className="login-middle-top">
                    <h1>My PC Maker</h1>
                </div>

                <div className="login-middle-center">
                    <CadastroForm
                        titulo={"LOGIN"}
                        usuario={"Usuário/E-mail"}
                        senha={"Senha"}
                        nomeButton={"LOGAR"}
                    />
                </div>

                <div className="login-middle-bottom">
                    <span>Ainda não possui <Link to={"/cadastro"}>cadastro</Link>?</span>
                </div>
            </div>
        </div>

        <div className="login-left">
            <div className="login-left-center">
                <img src="./images/logo-grande.png" alt="" width={"35%"}/>
                <div className="login-left-texto">
                    <h1>BEM VINDO DE VOLTA!</h1>
                    <div className="login-left-span">
                    <span>bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla</span>
                    </div>
                </div>
            </div>

            <div className="login-left-bottom">
                <img src="https://pcnetinformatica.com.br/wp-content/uploads/2023/04/produtos-pcgamers-1024x1024.png" alt="" width={"45%"}/>
            </div>

        </div>

    </section>
  )
}

export default Login