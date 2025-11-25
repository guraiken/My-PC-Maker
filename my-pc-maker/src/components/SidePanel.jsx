import "./SidePanel.css"

function SidePanel({titulo, texto}) {
  return (
      <div className="panel-left">
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
              <img src="https://pcnetinformatica.com.br/wp-content/uploads/2023/04/produtos-pcgamers-1024x1024.png" alt="" width={"45%"} />
          </div>
      </div>
  )
}

export default SidePanel