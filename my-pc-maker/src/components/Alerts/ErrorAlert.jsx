import Swal from "sweetalert2"

function ErrorAlert({titulo, texto, tempo}) {

    if(!texto){
        Swal.fire({
            position: "center",
            icon: "error",
            title: titulo,
            customClass: {
                timerProgressBar: 'progressBar'
            },
            showConfirmButton: false,
            background: "var(--fundo)",
            color: "var(--texto-principal)", 
            iconColor: "var(--destaque)",
            timer: tempo ? tempo : 1500,
            timerProgressBar: tempo ? tempo : 1500,
            width: "40%",
        })
    }else{

        Swal.fire({
            position: "center",
            icon: "error",
            title: titulo,
            text: texto,
            customClass: {
                timerProgressBar: 'progressBar'
            },
            showConfirmButton: false,
            background: "var(--fundo)",
            color: "var(--texto-principal)",
            iconColor: "var(--destaque)",
            timer: tempo ? tempo : 1500,
            timerProgressBar: tempo ? tempo : 1500,
            width: "40%",
        })
    }
}

export default ErrorAlert