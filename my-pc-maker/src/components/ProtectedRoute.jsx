import { useContext, useEffect } from "react"
import { GlobalContext } from "../contexts/globalContext"
import { useNavigate } from "react-router-dom"
import { div } from "framer-motion/client"
import Swal from "sweetalert2"
import "./ProtectedRoute.css"

function ProtectedRoute({children}) {
    const {usuarioLogado} = useContext(GlobalContext)
    const navegar = useNavigate()

    if (!usuarioLogado) {
        let timerInterval;
        Swal.fire({
            title: "USUÁRIO DESLOGADO",
            html: "Redirecionando para o login em <b></b> segundos.",
            loaderHtml: '<div class="my-custom-spinner"></div>',
            customClass: {
                timerProgressBar: 'progressBar'
            },
            width: "35%",
            heightAuto: true,
            background: "var(--profundidade)",
            color: "white",
            iconColor: "var(--destaque)",
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector("b");
                timerInterval = setInterval(() => {
                    timer.textContent = `${(Swal.getTimerLeft() / 1000).toFixed(2)}`;
                }, 100);
            },
            willClose: () => {
                clearInterval(timerInterval);
                navegar('/')
            }
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log("I was closed by the timer");
            }
        });
    }

  return (
    <div>
        { usuarioLogado ? 
        <section>
            {children}
        </section>
        :
        <>
        </>
        }
    </div>
  )
}

export default ProtectedRoute