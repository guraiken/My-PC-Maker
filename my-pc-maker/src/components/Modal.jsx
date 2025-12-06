import { useContext, useState } from "react"
import "./Modal.css"
import { GlobalContext } from "../contexts/globalContext"
import { FaWindowClose } from "react-icons/fa";
import { WiDayThunderstorm } from "react-icons/wi";
import { motion, AnimatePresence, delay } from "framer-motion"


function Modal({children, width, height, titulo}) {
  
  const {isOpen, setIsOpen} = useContext(GlobalContext)

  // Variants para o Fundo Escuro (Fade In/Out)
const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

// Variants para o Conteúdo do Modal (Slide Down/Up)
const modalContentVariants = {
  initial: { 
    y: "-100vh", // Começa fora da tela (acima)
    opacity: 0,
  },
  animate: {
    y: "0", // Posição central na tela
    opacity: 1,
    transition: {
      delay: 0.1,
      duration: 0.3,
      type: "spring",
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    y: "100vh", // Desliza para baixo e para fora
    opacity: 0,
  },
}


  return (
    <AnimatePresence 
      // Opcional: Evita que a animação inicial (entrada) ocorra na primeira montagem
      initial={false} 
    > 
    {/* Somente renderiza se isOpen for true */}
    { isOpen &&
      // 1. Fundo Escuro: use motion.section
      <motion.section 
        className="modal-container"
        variants={backdropVariants}
        initial="initial" // Inicia com o estado 'initial'
        animate="animate" // Transiciona para o estado 'animate'
        exit="exit"       // Transiciona para o estado 'exit' ao fechar
        // Adicionamos a lógica para fechar o modal clicando no fundo
        onClick={() => setIsOpen(false)}
      >
        {/* 2. Conteúdo do Modal: use motion.div */}
        <motion.div 
          className="modal" 
          style={{width : width ? width : '80%', height: height ? height : '80%'}}
          variants={modalContentVariants} // Usa as variants de slide
          initial="initial"
          animate="animate"
          exit="exit"
          // Importante: impede que o clique no modal feche o modal
          onClick={(e) => e.stopPropagation()} 
        >
          <div className="modal-top">
            <div className="div-linguica"></div>
            {titulo && <div className="modal-titulo"><h1>{titulo}</h1></div>}
            <div className="modal-close-button"><span onClick={() => setIsOpen(false)}><FaWindowClose/></span></div>
          </div>
          <div className="modal-content">
              {children}
          </div>
        </motion.div>
      </motion.section>
    }
    </AnimatePresence>
  )
}

export default Modal