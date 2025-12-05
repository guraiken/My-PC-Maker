import { useContext, useEffect, useRef, useState } from "react"
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

    const inputRefEmail = useRef(null)
    const inputRefUsuario = useRef(null)
    const {usuarioLogado, setUsuarioLogado, usuarios, setUsuarios} = useContext(GlobalContext)

    const navegar = useNavigate()

    function limparForm(){
        setUsuarioInput('')
        setEmailInput('')
        setSenhaInput('')
    }

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get("https://my-pc-maker-cq8f.vercel.app/usuario")
            setUsuarios(response.data)
        }
        catch (error){
            console.error("Erro ao buscar usuários:", error)
        }
    }

    useEffect(()=> {
        fetchUsuarios();
        if(titulo === "CADASTRO"){
            inputRefUsuario.current.focus()
        }else if (titulo === "LOGIN"){
            inputRefEmail.current.focus()
        }
    }, []);

    useEffect(()=> {
        console.log(usuarios)
    }, [usuarios]);

    

    const cadastrarUsuario = async (e) => {
        e.preventDefault()
        const buttonCadastro = e.nativeEvent.submitter.className
        const acharUser = usuarios.find(usuario => usuario.email === emailInput)

        if(buttonCadastro === "button-cadastro"){
            const usuario = {
                nome: usuarioInput,
                senha: senhaInput,
                email: emailInput
            };
            if (acharUser) {
                    Swal.fire({
                        position: "top",
                        icon: "error",
                        title: "E-mail já cadastrado!",
                        customClass: {
                            timerProgressBar: 'progressBar'
                        },
                        text: "Utilize outro e-mail para cadastrar.",
                        showConfirmButton: false,
                        background: "var(--fundo)",
                        color: "var(--texto-principal)",
                        iconColor: "var(--destaque)",
                        timer: 1500,
                        timerProgressBar: 1500,
                        width: "30%",
                        toast: true
                 }) 
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
            if(usuarioInput == null || senhaInput == null || emailInput == null){
                Swal.fire({
                    position: "top",
                    icon: "error",
                    title: "Preencha todos os campos!",
                    customClass: {
                        timerProgressBar: 'progressBar'
                    },
                    text: "Verifique os campos preenchidos.",
                    showConfirmButton: false,
                    background: "var(--fundo)",
                    color: "var(--texto-principal)", 
                    iconColor: "var(--destaque)",
                    timer: 1500,
                    timerProgressBar: 1500, 
                    width: "30%",
                    toast: true
                })

            }else{
                
            try{
                const response = await axios.post("https://my-pc-maker-cq8f.vercel.app/usuario", usuario);
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
                    navegar('/')
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
    }
}else {
    logarUsuario()
}
};

const logarUsuario = async () => {
    try {
        const response = await axios.get(`https://my-pc-maker-cq8f.vercel.app/usuario/${emailInput}`);
        const usuario = response.data;

        // 1. VALIDAR CAMPOS OBRIGATÓRIOS
        if (!emailInput || !senhaInput) {
            return Swal.fire({
                    position: "top",
                    icon: "error",
                    title: "Preencha todos os campos!",
                    customClass: {
                        timerProgressBar: 'progressBar'
                    },
                    text: "Verifique os campos preenchidos.",
                    showConfirmButton: false,
                    background: "var(--fundo)",
                    color: "var(--texto-principal)", 
                    iconColor: "var(--destaque)",
                    timer: 1500,
                    timerProgressBar: 1500, 
                    width: "30%",
                    toast: true
                })
        }

        // 2. VERIFICAR SE USUÁRIO EXISTE
        if (!usuario) {
            return Swal.fire({
                icon: "error",
                title: "Usuário não encontrado!",
                background: "var(--fundo)",
                color: "var(--texto-principal)", 
                iconColor: "var(--destaque)",
                heightAuto: true,
                timerProgressBar: true,
                customClass: {
                    timerProgressBar: 'progressBar'
                },
                showConfirmButton: false,
                timer: 1500
            });
        }

        // 3. SENHA INCORRETA
        if (usuario.senha !== senhaInput) {
            return Swal.fire({
                position: "top",
                icon: "error",
                title: "Senha incorreta",
                text: "Por favor tente novamente.",
                showConfirmButton: false,
                background: "var(--fundo)",
                color: "var(--texto-principal)", 
                iconColor: "var(--destaque)",
                timer: 1500,
                toast: true
            });
        }

        // 4. LOGIN OK
        limparForm();
        setUsuarioLogado(usuario);

        Swal.fire({
            position: "center",
            icon: "success",
            title: "Usuário logado com sucesso",
            showConfirmButton: false,
            background: "var(--fundo)",
            color: "var(--texto-principal)", 
            iconColor: "var(--destaque)",
            timer: 1200
        });

        setTimeout(() => navegar('/montagem'), 1200);

    } catch (error) {
        console.error("Erro ao logar:", error);
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
    
    return (
        <form className='cadastro-form' onSubmit={(e) => cadastrarUsuario(e)}>
            <div className="cadastro-title">
                <h2>{titulo}</h2>
            </div>

            <div className="cadastro-form-inputs">
                {usuario &&
                    <>
                    <label htmlFor="">{usuario}</label>
                    <input type="text"
                    className="input-usuario" 
                    ref={inputRefUsuario}
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
                    ref={inputRefEmail}
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
                    <button type="submit" className="button-cadastro">{nomeButton}</button>
                    </>}
                    {titulo == "LOGIN" &&<>
                    <button type="submit" className="button-login">{nomeButton}</button>
                    </>}
                </>
                } 
            </div>
        </form>
    )
}


export default CadastroForm