import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa'

function Footer() {
  const navigate = useNavigate()

  return (
    <footer className='w-full bg-[#FAFBFC] border-t border-gray-200 pb-24 md:pb-0'>
      <div className='max-w-[1600px] mx-auto px-4 lg:px-12 py-10 md:py-16'>
        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8'>
          
          {/* Brand Section */}
          <div className='col-span-2 lg:col-span-2'>
            <div className='flex items-center gap-2 mb-6 cursor-pointer' onClick={() => navigate('/')}>
               <h3 className='text-2xl font-bold tracking-tight text-gray-900'>One<span className='text-[#ff3f6c]'>Cart</span></h3>
            </div>
            <p className='text-gray-500 text-sm leading-relaxed max-w-sm mb-6'>
              Your ultimate shopping destination for fashion and lifestyle. High-quality products, unbeatable deals, and fast delivery right to your doorstep.
            </p>
            <div className='flex gap-4'>
              <a href='#' className='w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#ff3f6c] transition-all shadow-sm'>
                <FaFacebook className="w-[18px] h-[18px]" />
              </a>
              <a href='#' className='w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#ff3f6c] transition-all shadow-sm'>
                <FaTwitter className="w-[18px] h-[18px]" />
              </a>
              <a href='#' className='w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#ff3f6c] transition-all shadow-sm'>
                <FaInstagram className="w-[18px] h-[18px]" />
              </a>
              <a href='#' className='w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#ff3f6c] transition-all shadow-sm'>
                <FaYoutube className="w-[18px] h-[18px]" />
              </a>
            </div>
          </div>

          {/* ONLINE SHOPPING */}
          <div>
            <h4 className='text-gray-900 font-bold text-sm mb-5 tracking-wide uppercase'>Online Shopping</h4>
            <ul className='space-y-3'>
              <li>
                <button onClick={() => navigate('/collection?category=Kids')} className='text-gray-500 hover:text-[#ff3f6c] hover:font-semibold text-sm transition-all'>
                  Kids
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/collection?subCategory=TopWear')} className='text-gray-500 hover:text-[#ff3f6c] hover:font-semibold text-sm transition-all'>
                  Topwear
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/collection?subCategory=BottomWear')} className='text-gray-500 hover:text-[#ff3f6c] hover:font-semibold text-sm transition-all'>
                  Bottomwear
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/collection?subCategory=WinterWear')} className='text-gray-500 hover:text-[#ff3f6c] hover:font-semibold text-sm transition-all'>
                  Winterwear
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/collection?category=beauty')} className='text-gray-500 hover:text-[#ff3f6c] hover:font-semibold text-sm transition-all'>
                  Beauty
                </button>
              </li>
            </ul>
          </div>

          {/* USEFUL LINKS */}
          <div>
            <h4 className='text-gray-900 font-bold text-sm mb-5 tracking-wide uppercase'>Useful Links</h4>
            <ul className='space-y-3'>
              <li>
                <button onClick={() => navigate('/about')} className='text-gray-500 hover:text-[#ff3f6c] hover:font-semibold text-sm transition-all'>
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className='text-gray-500 hover:text-[#ff3f6c] hover:font-semibold text-sm transition-all'>
                  Contact Us
                </button>
              </li>
              <li>
                <button className='text-gray-500 hover:text-[#ff3f6c] hover:font-semibold text-sm transition-all'>
                  FAQ
                </button>
              </li>
              <li>
                <button className='text-gray-500 hover:text-[#ff3f6c] hover:font-semibold text-sm transition-all'>
                  T&C
                </button>
              </li>
              <li>
                <button className='text-gray-500 hover:text-[#ff3f6c] hover:font-semibold text-sm transition-all'>
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* CUSTOMER POLICIES */}
          <div>
            <h4 className='text-gray-900 font-bold text-sm mb-5 tracking-wide uppercase'>Customer Policies</h4>
            <ul className='space-y-3'>
              <li className='text-gray-500 text-sm cursor-pointer hover:text-[#ff3f6c] hover:font-semibold transition-all'>
                Track Orders
              </li>
              <li className='text-gray-500 text-sm cursor-pointer hover:text-[#ff3f6c] hover:font-semibold transition-all'>
                Shipping
              </li>
              <li className='text-gray-500 text-sm cursor-pointer hover:text-[#ff3f6c] hover:font-semibold transition-all'>
                Cancellation
              </li>
              <li className='text-gray-500 text-sm cursor-pointer hover:text-[#ff3f6c] hover:font-semibold transition-all'>
                Returns
              </li>
              <li className='text-gray-500 text-sm cursor-pointer hover:text-[#ff3f6c] hover:font-semibold transition-all'>
                Grievance Officer
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-gray-200 mt-12 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-gray-500 text-sm text-center md:text-left'>
              © {new Date().getFullYear()} OneCart. All rights reserved.
            </p>
            <div className='flex gap-2 text-sm text-gray-500 items-center font-semibold'>
              Made with <span className="text-[#ff3f6c] text-lg">♥</span> for fashion
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer