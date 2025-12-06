import "./SidePanel.css"
import { motion, transform } from "framer-motion"

function SidePanel({titulo, texto, panelDirection}) {
    
  return (
      <motion.div className="panel-left"
        initial={{opacity: 1, x: panelDirection === "left" ? "100%" : "-100%", filter: "blur(1px)"}}
        animate={{opacity: 1, x: 0, filter: "blur(0px)"}}
        transition={{
            type: "spring", stiffness: 120, damping: 20, ease: "easeInOut", duration: 0.5
        }}
      >
          <div className="panel-left-center">
              <img src="./images/logo-grande.png" alt="" width={"35%"} />
              <div className="panel-left-texto">
                  <h1>{titulo}</h1>
                  <div className="panel-left-span">
                      <span>{texto}</span>
                  </div>
              </div>
          </div>

          <div className="panel-left-bottom">
              <img src="./svgs/pc-icon.svg" alt="" width={"20%"} style={{transform: "rotate(10deg)"}}/>
          </div>
      </motion.div>
  )
}

export default SidePanel