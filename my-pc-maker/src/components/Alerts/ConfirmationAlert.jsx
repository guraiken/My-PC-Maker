import Swal from 'sweetalert2'

function ConfirmationAlert({titulo, texto, tempo, posicao, toaster}) {

    if(texto){
        Swal.fire({
        position: posicao ? posicao : "center",
        icon: "success",
        title: titulo,
        text: texto,
        showConfirmButton: false,
        background: "var(--fundo)",
        color: "var(--texto-principal)", 
        iconColor: "var(--destaque)",
        timer: tempo ? tempo : 1200, 
        customClass: {
            timerProgressBar: 'progressBar'
        },
        timerProgressBar: true,
        width: "40%",
        heightAuto: "20%",
        toast: toaster ? toaster : false
        });
    }else{
        Swal.fire({
        position: posicao ? posicao : "center",
        icon: "success",
        title: titulo,
        showConfirmButton: false,
        background: "var(--fundo)",
        color: "var(--texto-principal)", 
        iconColor: "var(--destaque)",
        timer: tempo ? tempo : 1200,
        customClass: {
            timerProgressBar: 'progressBar'
        },
        timerProgressBar: true,
        width: "40%",
        heightAuto: "20%",
        toast: toaster ? toaster : false
        });
    }
}

export default ConfirmationAlert