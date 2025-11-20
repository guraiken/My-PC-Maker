import { useContext, useEffect, useState } from "react"
import axios from "axios"
import "./CadastroForm.css"
import { GlobalContext } from "../contexts/globalContext"
import { useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";



function CadastroForm({titulo,usuario, email, senha, nomeButton}) {
    const [mostrarSenha, setMostrarSenha] = useState()
    const [usuarioInput, setUsuarioInput] = useState() 
    const [emailInput, setEmailInput] = useState() 
    const [senhaInput, setSenhaInput] = useState()
    
    const [usuarios, setUsuarios] = useState([])
    const {usuarioLogado, setUsuarioLogado} = useContext(GlobalContext)

    const navegar = useNavigate()

    function limparForm(){
        setUsuarioInput('')
        setEmailInput('')
        setSenhaInput('')
    }

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get("http://localhost:3000/usuario")
            setUsuarios(response.data)
        }
        catch (error){
            console.error("Erro ao buscar usuários:", error)
        }
    }

    useEffect(()=> {
        fetchUsuarios();
    }, []);

    useEffect(()=> {
        console.log(usuarios)
    }, [usuarios]);

    const cadastrarUsuario = async () => {
        try{
            const usuario = {
                nome: usuarioInput,
                senha: senhaInput,
                email: emailInput
            };
            const response = await axios.post("http://localhost:3000/usuario", usuario);
            if(response.status === 201){
                fetchUsuarios()
                limparForm()
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Usuário cadastrado com sucesso",
                    showConfirmButton: false,
                    background: "var(--fundo)",
                    color: "var(--texto-principal)", 
                    iconColor: "var(--destaque)",
                    timer: 1200, 
                    width: "30%",
                    heightAuto: "20%",
                })
                setTimeout(() => {
                    navegar('/login')
                }, '1200')
            }
        }
        catch (error){
            console.error("Erro ao adicionar usuario:", error)
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Erro: 500",
                text: "Servidor OFFLINE",
                showConfirmButton: false,
                background: "var(--fundo)",
                color: "var(--texto-principal)", 
                iconColor: "var(--destaque)",
                timer: 1400, 
                width: "30%",
                heightAuto: "20%",
            })
        }
    };

    const logarUsuario = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/usuario/${emailInput}`)
            console.log(response.data)
            if(response.status === 200){
                if(response.data.senha === senhaInput){
                    limparForm()
                    const usuario = response.data
                    localStorage.setItem("usuarioLogado", JSON.stringify(usuario))
                    setUsuarioLogado(JSON.parse(localStorage.getItem("usuarioLogado")));
                    Swal.fire({  
                        position: "center",
                        icon: "success",
                        title: "Usuário logado com sucesso",
                        showConfirmButton: false,
                        background: "var(--fundo)",
                        color: "var(--texto-principal)", 
                        iconColor: "var(--destaque)",
                        timer: 1200, 
                        width: "30%",
                        heightAuto: "20%",
                    })
                    setTimeout(() => {
                        navegar('/montagem')
                    }, '1200')
                } else {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Erro: Verifique os dados inseridos",
                        showConfirmButton: false,
                        background: "var(--fundo)",
                        color: "var(--texto-principal)", 
                        iconColor: "var(--destaque)",
                        timer: 1400, 
                        width: "30%",
                    })
                }
            }
        }
        catch (error){
            console.error('Não foi possível logar no usuário:', error)
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Erro: 500",
                text: "Servidor OFFLINE",
                showConfirmButton: false,
                background: "var(--fundo)",
                color: "var(--texto-principal)", 
                iconColor: "var(--destaque)",
                timer: 1400, 
                width: "30%",
                heightAuto: "20%",
            })
        }
    }
    
    return (
        <form className='cadastro-form'>
            <div className="cadastro-title">
                <h2>{titulo}</h2>
            </div>

            <div className="cadastro-form-inputs">
                {usuario &&
                    <>
                    <label htmlFor="">{usuario}</label>
                    <input type="text"
                    className="input-usuario" 
                    value={usuarioInput}
                    onChange={(e) => setUsuarioInput(e.target.value)}
                    />
                    </>
                }
                {email &&
                    <>
                    <label htmlFor="">{email}</label>
                    <input type="text" 
                    className="input-email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    />
                    </>
                }
                <label htmlFor="">{senha}</label>
                <div className="input-senha">
                <input type={mostrarSenha ? "text" : "password"}
                value={senhaInput}
                onChange={(e) => setSenhaInput(e.target.value)}
                />
                { !mostrarSenha &&
                    <FaEye onClick={() => setMostrarSenha(!mostrarSenha)} color="var(--destaque)" fontSize={"24px"} style={{cursor: "pointer"}}/>
                }
                { mostrarSenha &&
                    <FaEyeSlash onClick={() => setMostrarSenha(!mostrarSenha)} color="var(--fundo)" fontSize={"24px"} style={{cursor: "pointer"}}/>
                }
                </div>
            </div>
            <div className="cadastro-form-button">
                {<>
                    {titulo == "CADASTRO" &&<>
                    <button type="button" onClick={cadastrarUsuario}>{nomeButton}</button>
                    </>}
                    {titulo == "LOGIN" &&<>
                    <button type="button" onClick={logarUsuario}>{nomeButton}</button>
                    </>}
                </>
                } 
            </div>
        </form>
    )
}

export default CadastroForm