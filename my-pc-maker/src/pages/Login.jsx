import { Link } from "react-router-dom"
import CadastroForm from "../components/CadastroForm"
import "./Login.css"
import { useContext } from "react"
import { GlobalContext } from "../contexts/globalContext"
import SidePanel from "../components/SidePanel"
import { motion } from "framer-motion"


function Login() {
    const {usuarioLogado} = useContext(GlobalContext)
    console.log (usuarioLogado)

  return (
    <section className="login-container">

        <motion.div className="login-right"
        initial={{opacity: 1, x: "20vw", filter: "blur(2px)"}}
        animate={{opacity: 1, x: 0, filter: "blur(0px)"}}
        transition={{
            type: "spring", stiffness: 80, damping: 15
        }}
        >
            <div className="login-middle-container">
                <div className="login-middle-top">
                    <h1>My PC Maker</h1>
                </div>

                <div className="login-middle-center">
                    <CadastroForm
                        titulo={"LOGIN"}
                        email={"E-mail"}
                        senha={"Senha"}
                        nomeButton={"LOGAR"}
                    />
                </div>

                <div className="login-middle-bottom">
                    <span>Ainda não possui <Link to={"/cadastro"}>cadastro</Link>?</span>
                </div>
            </div>
        </motion.div>

        <SidePanel
        titulo={"BEM VINDO DE VOLTA!"}
        texto={"Estamos ansiosos para ver o que você vai montar."}
        />

    </section>
  )
}

export default Login