import "./CadastroForm.css"

function CadastroForm({titulo,usuario, email, senha, nomeButton}) {
    return (
        <div className='cadastro-form'>
            
            <div className="cadastro-title">
                <h2>{titulo}</h2>
            </div>

            <div className="cadastro-form-inputs">
                <label htmlFor="">{usuario}</label>
                <input type="text" />
                {email &&
                    <>
                    <label htmlFor="">{email}</label>
                    <input type="text" />
                    </>
                }
                <label htmlFor="">{senha}</label>
                <input type="text" />
            </div>
            <div className="cadastro-form-button">
                <button>{nomeButton}</button>
            </div>

        </div>
    )
}

export default CadastroForm