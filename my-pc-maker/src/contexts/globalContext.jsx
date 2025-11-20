import { createContext, useState } from "react";

export const GlobalContext = createContext()

export const GlobalContextProvider = ({children}) => {
    const [usuarioLogado, setUsuarioLogado] = useState(() => {
        const userStorage = localStorage.getItem("usuarioLogado")
        if (userStorage) {
            // Se tiver dados, transforma em objeto e inicia o estado com eles
            
            return JSON.parse(userStorage)
        }
        // Se não tiver nada, inicia como null
        return null
    })
    
    // criar tudo que queira compartilhar acima do return
    return(
        <GlobalContext.Provider 
        value={
            {usuarioLogado, setUsuarioLogado}}>
            {children}
        </GlobalContext.Provider>
    )    
}

