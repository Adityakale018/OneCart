import React, { createContext, useContext } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'

import { useEffect,useState } from 'react'

export const userDatacontext = createContext()

function UserContext({children}) {
    const [userData, setuserData] = useState("")
    const [isAuthLoading, setIsAuthLoading] = useState(true)
    let {serverUrl} = useContext(authDataContext)

    const getCurrentUser = async () => {
        try {
            let result = await axios.get(serverUrl + "/api/user/getcurrentuser",{withCredentials:true})
            setuserData(result.data)
            console.log(result.data)
        } catch (error) {
            setuserData(null)
            console.log(error)
        } finally {
            setIsAuthLoading(false)
        }
    }

    useEffect(() => {
     getCurrentUser()
    }, [])
    

    let value = {
        userData, setuserData, getCurrentUser, isAuthLoading
    }

   
  return (
    <div>
        <userDatacontext.Provider value={value}>
            {children}
        </userDatacontext.Provider>
      
    </div>
  )
}

export default UserContext

