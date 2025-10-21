// creqting a user prefrences context
import { createContext, useState } from "react";

const PrefrencesContext = createContext(true);
export async function UserPrefrencesContext() {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    return (
        <PrefrencesContext.Provider value={isOpen}>

        </PrefrencesContext.Provider>    
    )
}