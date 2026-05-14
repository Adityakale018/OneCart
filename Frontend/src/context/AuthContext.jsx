import React, { createContext } from 'react'

export const authDataContext = createContext()

function AuthContext({children}) {

    let serverUrl = import.meta.env.DEV ? "http://localhost:8000" : "https://onecart-backend-wtab.onrender.com"
    let value = { serverUrl }
        
   
  return (
    <div>
        <authDataContext.Provider value={value}>
            {children}
        </authDataContext.Provider>
      
    </div>
  )
}

export default AuthContext
