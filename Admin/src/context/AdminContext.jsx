import React, { createContext, useContext,useState,useEffect } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'
export const adminDataContext = createContext()

function AdminContext({children}) {
  const [adminData, setAdminData] = useState(null)
  let {serverUrl} = useContext(authDataContext)

 
  const getAdmin = async () => {
    try {
      let result= await axios.get(serverUrl+"/api/user/getadmin",{withCredentials:true})
      setAdminData(result.data)
      console.log(result.data)
    } catch (error) {
      setAdminData(null)
      console.log(error)
    }
  }
  let value = {
    adminData,setAdminData,getAdmin
  }
  useEffect(() => {
    getAdmin()
  }, [])


  
  return (
    <div>
      <adminDataContext.Provider value={value}>
        {children}
      </adminDataContext.Provider>
    </div>
  )
}

export default AdminContext

