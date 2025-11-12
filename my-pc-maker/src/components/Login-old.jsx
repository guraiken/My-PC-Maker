
import "./Login.css";


function Login(){
return(

<div className="login-container">

<div className="left-side">
        <img className="logo" />
        <h1>Bem-vindo de volta!</h1>
        <p>Acesse sua conta e continue gerenciando tudo com facilidade.</p>
      </div>

    <div className="right-side">
        <div className="login-box">
             <h2>LOGIN</h2>

            <form action="">
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder='Enter email' />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Senha</label>
                    <input type="password" placeholder='Enter password' />                    
                </div>
                    <button type='submit' className="btn-login">Login</button>
            </form>

            <p className="signup-text">
          Ainda não possui <span>cadastro?</span>
        </p>
        </div>
    </div>
    </div>
)

}

export default Login
