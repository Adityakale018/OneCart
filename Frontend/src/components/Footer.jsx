import React from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/vcart_logo.png'

function Footer() {
  const navigate = useNavigate()

  return (
    <footer className='w-full bg-slate-900 border-t border-slate-800 mb-16 md:mb-0'> {/* Removed mt-20 */}
      <div className='max-w-[1600px] mx-auto px-6 py-12'>
        {/* Rest of the code stays the same */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12'>
          
          {/* Brand Section */}
          <div className='md:col-span-2'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 bg-cyan-600 rounded-lg p-2'>
                <img src={Logo} alt="OneCart" className='w-full h-full object-contain' />
              </div>
              <h3 className='text-xl font-bold text-white'>OneCart</h3>
            </div>
            <p className='text-slate-400 text-sm leading-relaxed max-w-md'>
              Your all-in-one destination for top-quality products, unbeatable deals, and fast delivery. 
              Designed to make your shopping experience simple and satisfying.
            </p>
            <div className='flex gap-4 mt-6'>
              <a href='#' className='w-9 h-9 bg-slate-800 hover:bg-cyan-600 rounded-lg flex items-center justify-center transition-colors'>
                <span className='text-white text-lg'>f</span>
              </a>
              <a href='#' className='w-9 h-9 bg-slate-800 hover: bg-cyan-600 rounded-lg flex items-center justify-center transition-colors'>
                <span className='text-white text-lg'>𝕏</span>
              </a>
              <a href='#' className='w-9 h-9 bg-slate-800 hover: bg-cyan-600 rounded-lg flex items-center justify-center transition-colors'>
                <span className='text-white text-lg'>in</span>
              </a>
              <a href='#' className='w-9 h-9 bg-slate-800 hover:bg-cyan-600 rounded-lg flex items-center justify-center transition-colors'>
                <span className='text-white text-lg'>📷</span>
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className='text-white font-semibold mb-4'>Company</h4>
            <ul className='space-y-2'>
              <li>
                <button onClick={() => navigate('/')} className='text-slate-400 hover:text-cyan-400 text-sm transition-colors'>
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/about')} className='text-slate-400 hover: text-cyan-400 text-sm transition-colors'>
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/collection')} className='text-slate-400 hover:text-cyan-400 text-sm transition-colors'>
                  Collections
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className='text-slate-400 hover:text-cyan-400 text-sm transition-colors'>
                  Contact
                </button>
              </li>
              <li>
                <button className='text-slate-400 hover:text-cyan-400 text-sm transition-colors'>
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className='text-white font-semibold mb-4'>Get In Touch</h4>
            <ul className='space-y-2'>
              <li className='text-slate-400 text-sm'>
                +91 8788892095
              </li>
              <li className='text-slate-400 text-sm'>
                onecart@gmail.com
              </li>
              <li className='text-slate-400 text-sm'>
                +1-123-456-789
              </li>
              <li className='text-slate-400 text-sm'>
                admin@onecart. com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-slate-800 mt-12 pt-6'>
          <div className='flex flex-col md: flex-row justify-between items-center gap-4'>
            <p className='text-slate-500 text-sm text-center md:text-left'>
              © 2026 OneCart. All rights reserved.
            </p>
            <div className='flex gap-6 text-sm'>
              <button className='text-slate-500 hover:text-cyan-400 transition-colors'>
                Terms
              </button>
              <button className='text-slate-500 hover:text-cyan-400 transition-colors'>
                Privacy
              </button>
              <button className='text-slate-500 hover:text-cyan-400 transition-colors'>
                Cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer