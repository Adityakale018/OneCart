import React, { useContext, useState } from 'react'
import Logo from "../assets/vcart_logo.png"
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { FiMail, FiLock, FiShield } from "react-icons/fi";
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
import { adminDataContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [show, setshow] = useState(false)
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [loading, setLoading] = useState(false)
  let {serverUrl} = useContext(authDataContext)
  let {getAdmin} = useContext(adminDataContext)
  let navigate = useNavigate()

  const AdminLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let result = await axios.post(serverUrl + "/api/auth/adminlogin", {email, password}, {withCredentials: true})
      console.log(result.data)
      await getAdmin()
      navigate("/")
    } catch (error) {
      console.log(error)
      alert("Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full min-h-screen bg-slate-950 flex flex-col items-center justify-start py-8 px-4'>
      
      {/* Header with Logo */}
      <div className='flex items-center gap-3 mb-8'>
        <div className='w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg p-2 shadow-lg shadow-violet-500/30'>
          <img className="w-full h-full object-contain" src={Logo} alt="logo" />
        </div>
        <h1 className="text-2xl font-bold text-white">OneCart</h1>
      </div>

      {/* Welcome Text */}
      <div className='text-center mb-8'>
        <div className='w-16 h-16 bg-violet-600/20 rounded-full flex items-center justify-center mx-auto mb-4'>
          <FiShield className='w-8 h-8 text-violet-400' />
        </div>
        <h2 className='text-3xl font-bold text-white mb-2'>Admin Login</h2>
        <p className='text-slate-400'>Access the OneCart admin panel</p>
      </div>

      {/* Login Card */}
      <div className='w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-8 shadow-xl'>
        <form onSubmit={AdminLogin} className='space-y-5'>
          
          {/* Email Input */}
          <div>
            <label className='text-slate-400 text-sm mb-2 block'>Email Address</label>
            <div className='relative'>
              <FiMail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500' />
              <input
                type="email"
                className='w-full h-12 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 pl-12 pr-4 focus:outline-none focus:border-violet-600 transition-colors'
                placeholder='admin@onecart.com'
                required
                onChange={(e) => setemail(e.target.value)}
                value={email}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className='text-slate-400 text-sm mb-2 block'>Password</label>
            <div className='relative'>
              <FiLock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500' />
              <input
                type={show ?  "text" : "password"}
                className='w-full h-12 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 pl-12 pr-12 focus:outline-none focus: border-violet-600 transition-colors'
                placeholder='Enter your password'
                required
                onChange={(e) => setpassword(e.target.value)}
                value={password}
              />
              <button
                type='button'
                onClick={() => setshow(prev => !prev)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-violet-400 transition-colors'
              >
                {show ? <IoEye className='w-5 h-5' /> : <IoEyeOutline className='w-5 h-5' />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type='submit'
            disabled={loading}
            className='w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-violet-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
          >
            {loading ?  (
              <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className='mt-6 p-4 bg-violet-600/10 border border-violet-600/30 rounded-lg'>
          <div className='flex items-start gap-3'>
            <FiShield className='w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5' />
            <div>
              <h4 className='text-violet-400 font-semibold text-sm mb-1'>Admin Access Only</h4>
              <p className='text-slate-400 text-xs'>
                This area is restricted to authorized administrators only. All login attempts are monitored.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <p className='text-slate-500 text-xs text-center mt-8 max-w-md'>
        Protected by OneCart Security • All rights reserved
      </p>
    </div>
  )
}

export default Login