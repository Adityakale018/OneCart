import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from "../assets/vcart_logo.png"
import { FiLogOut } from 'react-icons/fi'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { adminDataContext } from '../context/AdminContext'

function Nav() {
    let navigate = useNavigate()
    let {serverUrl} = useContext(authDataContext)
    let {getAdmin, adminData} = useContext(adminDataContext)

    const logOut = async () => {
        try {
            let result = await axios. get(serverUrl + "/api/auth/logout", {withCredentials: true})
            console.log(result.data)
            getAdmin()
            navigate("/login")
        } catch (error) {
            console. log(error)
        }
    }

    return (
        <nav className='fixed top-0 left-0 right-0 h-[70px] bg-slate-900 border-b border-slate-800 z-50 shadow-xl'>
            <div className='h-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between'>
                
                {/* Logo */}
                <div 
                    className='flex items-center gap-3 cursor-pointer group'
                    onClick={() => navigate("/")}
                >
                    <div className='w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg p-2 shadow-lg shadow-violet-500/30'>
                        <img src={Logo} alt="OneCart" className='w-full h-full object-contain' />
                    </div>
                    <div>
                        <h1 className='text-xl font-bold text-white'>OneCart</h1>
                        <p className='text-xs text-violet-400'>Admin Panel</p>
                    </div>
                </div>

                {/* Right Section */}
                <div className='flex items-center gap-4'>
                    
                    {/* Admin Info (Optional) */}
                    {adminData && (
                        <div className='hidden md:flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg'>
                            <div className='w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold'>
                                {adminData?. name?. slice(0, 1).toUpperCase() || 'A'}
                            </div>
                            <div>
                                <p className='text-white text-sm font-semibold'>{adminData?.name || 'Admin'}</p>
                                <p className='text-slate-400 text-xs'>Administrator</p>
                            </div>
                        </div>
                    )}

                    {/* Logout Button */}
                    <button
                        onClick={logOut}
                        className='flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors border border-slate-700 hover:border-red-600'
                    >
                        <FiLogOut className='w-4 h-4' />
                        <span className='hidden sm:inline'>Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Nav