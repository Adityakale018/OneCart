import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/vcart_logo.png";
import google from "../assets/google.png"
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { FiMail, FiLock } from "react-icons/fi";
import { authDataContext } from "../context/authContext";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/Firebase";
import { userDatacontext } from "../context/UserContext";

function Login() {
  const [show, setshow] = useState(false)
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [loading, setLoading] = useState(false)
  let {serverUrl} = useContext(authDataContext)
  const navigate = useNavigate();
  let {getCurrentUser} = useContext(userDatacontext)

  const handlelogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + '/api/auth/login', {
        email, password
      }, {withCredentials: true})
      console.log(result.data)
      getCurrentUser()
      navigate("/")
    } catch (error) {
      console.log(error)
      alert("Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const googlelogin = async () => {
    try {
      const response = await signInWithPopup(auth, provider)
      let user = response. user
      let name = user. displayName; 
      let email = user.email

      const result = await axios.post(serverUrl + '/api/auth/googlelogin', {
        name, email
      }, {withCredentials: true})
      console.log(result.data)
      getCurrentUser()
      navigate("/")
    } catch (error) {
      console.log(error)
      alert("Google login failed. Please try again.")
    }
  }

  return (
    <div className='w-full min-h-screen bg-slate-950 flex flex-col items-center justify-start py-8 px-4'>
      
      {/* Header with Logo */}
      <div 
        className='flex items-center gap-3 mb-8 cursor-pointer group'
        onClick={() => navigate("/")}
      >
        <div className='w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg p-2 shadow-lg shadow-violet-500/30'>
          <img className="w-full h-full object-contain" src={Logo} alt="logo" />
        </div>
        <h1 className="text-2xl font-bold text-white">OneCart</h1>
      </div>

      {/* Welcome Text */}
      <div className='text-center mb-8'>
        <h2 className='text-3xl font-bold text-white mb-2'>Welcome Back</h2>
        <p className='text-slate-400'>Sign in to continue your shopping experience</p>
      </div>

      {/* Login Card */}
      <div className='w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-8 shadow-xl'>
        <form onSubmit={handlelogin} className='space-y-5'>
          
          {/* Google Login Button */}
          <button
            type='button'
            onClick={googlelogin}
            className='w-full h-12 bg-white hover:bg-gray-50 text-slate-900 font-semibold rounded-lg flex items-center justify-center gap-3 transition-colors'
          >
            <img src={google} alt="Google" className='w-5 h-5' />
            Continue with Google
          </button>

          {/* Divider */}
          <div className='flex items-center gap-4'>
            <div className='flex-1 h-px bg-slate-800'></div>
            <span className='text-slate-500 text-sm'>OR</span>
            <div className='flex-1 h-px bg-slate-800'></div>
          </div>

          {/* Email Input */}
          <div>
            <label className='text-slate-400 text-sm mb-2 block'>Email Address</label>
            <div className='relative'>
              <FiMail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500' />
              <input
                type="email"
                className='w-full h-12 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 pl-12 pr-4 focus:outline-none focus:border-violet-600 transition-colors'
                placeholder='Enter your email'
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

          {/* Forgot Password */}
          <div className='flex justify-end'>
            <button
              type='button'
              className='text-violet-400 text-sm hover: text-violet-300 transition-colors'
            >
              Forgot password?
            </button>
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

          {/* Sign Up Link */}
          <p className='text-center text-slate-400 text-sm'>
            Don't have an account? {' '}
            <button
              type='button'
              onClick={() => navigate("/signup")}
              className='text-violet-400 font-semibold hover:text-violet-300 transition-colors'
            >
              Create Account
            </button>
          </p>
        </form>
      </div>

      {/* Footer Note */}
      <p className='text-slate-500 text-xs text-center mt-8 max-w-md'>
        By continuing, you agree to OneCart's Terms of Service and Privacy Policy
      </p>
    </div>
  )
}

export default Login