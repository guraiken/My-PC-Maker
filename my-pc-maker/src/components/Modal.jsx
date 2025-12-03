import { useContext, useState } from "react"
import "./Modal.css"
import { GlobalContext } from "../contexts/globalContext"

function Modal({children}) {
  
  const {isOpen, setIsOpen} = useContext(GlobalContext)


  return (
    <>
    { isOpen &&
      <section className="modal-container">
      <div className="modal">
        <div className="modal-top">
          <span onClick={() => setIsOpen(false)}>&times</span>
        </div>
        <div className="modal-content">
            {children}
        </div>
      </div>
    </section>
    }
    </>
  )
}

export default Modal