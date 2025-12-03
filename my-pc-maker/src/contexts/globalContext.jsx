import { createContext, useState } from "react";

export const GlobalContext = createContext()

export const GlobalContextProvider = ({children}) => {
    const [usuarioLogado, setUsuarioLogado] = useState(false)

    const [isOpen, setIsOpen] = useState(false)
    
    // criar tudo que queira compartilhar acima do return
    return(
        <GlobalContext.Provider 
        value={
            {usuarioLogado, setUsuarioLogado, isOpen, setIsOpen}}>
            {children}
        </GlobalContext.Provider>
    )    
}

