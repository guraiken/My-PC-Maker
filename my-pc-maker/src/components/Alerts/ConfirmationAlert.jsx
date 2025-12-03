import Swal from 'sweetalert2'

function ConfirmationAlert({titulo, texto}) {

    if(texto){
        Swal.fire({
        position: "center",
        icon: "success",
        title: titulo,
        text: texto,
        showConfirmButton: false,
        background: "var(--fundo)",
        color: "var(--texto-principal)", 
        iconColor: "var(--destaque)",
        timer: 1200, 
        customClass: {
            timerProgressBar: 'progressBar'
        },
        timerProgressBar: true,
        width: "30%",
        heightAuto: "20%",
        });
    }else{
        Swal.fire({
        position: "center",
        icon: "success",
        title: titulo,
        showConfirmButton: false,
        background: "var(--fundo)",
        color: "var(--texto-principal)", 
        iconColor: "var(--destaque)",
        timer: 1200, 
        customClass: {
            timerProgressBar: 'progressBar'
        },
        timerProgressBar: true,
        width: "30%",
        heightAuto: "20%",
        });
    }
}

export default ConfirmationAlert