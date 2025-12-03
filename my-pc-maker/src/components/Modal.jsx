import { useContext, useState } from "react"
import "./Modal.css"
import { GlobalContext } from "../contexts/globalContext"
import { FaWindowClose } from "react-icons/fa";
import { WiDayThunderstorm } from "react-icons/wi";


function Modal({children, width, height}) {
  
  const {isOpen, setIsOpen} = useContext(GlobalContext)


  return (
    <>
    { isOpen &&
      <section className="modal-container">
      <div className="modal" style={{width : width ? width : '80%', height: height ? height : '80%'}}>
        <div className="modal-top">
          <span onClick={() => setIsOpen(false)}><FaWindowClose/></span>
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