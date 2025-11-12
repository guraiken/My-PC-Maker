import { useEffect, useState } from "react"
import axios from "axios"
import "./CadastroForm.css"

function CadastroForm({titulo,usuario, email, senha, nomeButton}) {
    const [mostrarSenha, setMostrarSenha] = useState()
    const [usuarioInput, setUsuarioInput] = useState() 
    const [emailInput, setEmailInput] = useState() 
    const [senhaInput, setSenhaInput] = useState()
    
    const [usuarios, setUsuarios] = useState([])

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
            const response = axios.post("http://localhost:3000/usuario", usuario);
            if(response.status === 201){
                fetchUsuarios()
                limparForm()
            }
        }
        catch (error){
            console.error("Erro ao adicionar usuario:", error)
        }
    }


    
    return (
        <div className='cadastro-form'>
            
            <div className="cadastro-title">
                <h2>{titulo}</h2>
            </div>

            <div className="cadastro-form-inputs">
                <label htmlFor="">{usuario}</label>
                <input type="text" 
                value={usuarioInput}
                onChange={(e) => setUsuarioInput(e.target.value)}
                />
                {email &&
                    <>
                    <label htmlFor="">{email}</label>
                    <input type="text" 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    />
                    </>
                }
                <label htmlFor="">{senha}</label>
                <input type={mostrarSenha ? "text" : "password"}
                value={senhaInput}
                onChange={(e) => setSenhaInput(e.target.value)}
                />
                <button onClick={() => setMostrarSenha(!mostrarSenha)}>olho</button>
            </div>
            <div className="cadastro-form-button">
                {<>
                    {titulo == "CADASTRO" &&<>
                    <button type="button" onClick={cadastrarUsuario}>{nomeButton}</button>
                    </>}
                    {titulo == "LOGIN" &&<>
                    <button>{nomeButton}</button>
                    </>}
                </>
                } 
            </div>

        </div>
    )
}

export default CadastroForm