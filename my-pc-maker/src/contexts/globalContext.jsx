import { createContext, useState } from "react";

export const GlobalContext = createContext()

export const GlobalContextProvider = ({children}) => {
    const [usuarioLogado, setUsuarioLogado] = useState(null)
    // criar tudo que queira compartilhar acima do return
    return(
        <GlobalContext.Provider 
        value={
            {usuarioLogado, setUsuarioLogado}}>
            {children}
        </GlobalContext.Provider>
    )    
}

