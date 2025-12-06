import { Link } from "react-router-dom"
import CadastroForm from "../components/CadastroForm"
import "./Cadastro.css"
import SidePanel from "../components/SidePanel"
import { motion } from "framer-motion"

function Cadastro() {
  return (
    <section className="cadastro-container">
        
        <SidePanel panelDirection={"left"}
        titulo={"BORA COMEÇAR!"}
        texto={"Monte o PC dos seus sonhos, veja quanto ele consome, seu valor e compartilhe!"}
        />

        <div className="cadastro-right">
            <motion.div className="cadastro-middle-container"
                initial={{opacity: 1, x: "-20vw", filter: "blur(2px)"}}
                animate={{opacity: 1, x: 0, filter: "blur(0px)"}}
                transition={{
                type: "spring", stiffness: 80, damping: 15
                }}
            >
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
            </motion.div>
        </div>

    </section>
  )
}

export default Cadastro