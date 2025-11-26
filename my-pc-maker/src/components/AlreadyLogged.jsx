import { useContext, useEffect } from "react"
import Swal from "sweetalert2"
import { GlobalContext } from "../contexts/globalContext"
import { useNavigate } from "react-router-dom"

function AlreadyLogged({children}) {
    const {usuarioLogado} = useContext(GlobalContext)
    const navegar = useNavigate()
    
    if (usuarioLogado) {  
        Swal.fire({
                    loaderHtml: '<div class="my-custom-spinner"></div>',
                    width: "100%",
                    heightAuto: true,
                    background: "transparent",
                    color: "white",
                    iconColor: "var(--destaque)",
                    timer: 400,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                    willClose: () => {
                        navegar('/montagem')
                    }
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        console.log("I was closed by the timer");
                    }
                });
    }

  return (
    <div>
        { !usuarioLogado ?
        <div>
            {children}
        </div>
        :
        <>

        </>
        }
        
    </div>
  )
}

export default AlreadyLogged