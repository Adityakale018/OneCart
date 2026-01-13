import React from 'react'
import { useNavigate } from 'react-router-dom'
import Title from '../components/Title'
import contact from "../assets/contact.jpg"
import NewLetterBox from '../components/NewLetterBox'
import Footer from '../components/Footer'

function Contact() {
  const navigate = useNavigate()

  return (
    <div className='w-full min-h-screen bg-slate-950 pt-24'>
      <div className='max-w-7xl mx-auto px-6 md:px-8 pb-16'>
        
        {/* Header */}
        <div className='text-center mb-16'>
          <Title text1={"CONTACT "} text2={"US"}/>
          <p className='text-slate-400 text-lg mt-4'>
            We'd love to hear from you.  Get in touch with our team. 
          </p>
        </div>

        {/* Main Content */}
        <div className='grid lg:grid-cols-2 gap-12 items-center mb-20'>
          
          {/* Image */}
          <div className='flex justify-center'>
            <div className='relative max-w-lg w-full'>
              <img 
                src={contact} 
                alt="Contact Us" 
                className='w-full rounded-lg shadow-xl'
              />
              <div className='absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg -z-10'></div>
            </div>
          </div>

          {/* Contact Info */}
          <div className='space-y-8'>
            
            {/* Store Location */}
            <div className='bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-violet-600 transition-colors'>
              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/30'>
                  <span className='text-2xl'>📍</span>
                </div>
                <div>
                  <h3 className='text-white font-bold text-lg mb-2'>Our Store</h3>
                  <p className='text-slate-400'>
                    12345 Pune<br/>
                    Pune, Maharashtra, India
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className='bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-emerald-600 transition-colors'>
              <div className='space-y-4'>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30'>
                    <span className='text-2xl'>📞</span>
                  </div>
                  <div>
                    <p className='text-slate-500 text-sm'>Phone</p>
                    <p className='text-white font-medium'>+91 12345 67890</p>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-500/30'>
                    <span className='text-2xl'>✉️</span>
                  </div>
                  <div>
                    <p className='text-slate-500 text-sm'>Email</p>
                    <p className='text-white font-medium'>admin@onecart.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Careers */}
            <div className='bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-amber-600 transition-colors'>
              <div className='flex items-start gap-4 mb-4'>
                <div className='w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/30'>
                  <span className='text-2xl'>💼</span>
                </div>
                <div>
                  <h3 className='text-white font-bold text-lg mb-2'>Careers at OneCart</h3>
                  <p className='text-slate-400'>
                    Learn more about our teams and current job openings.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/careers')}
                className='w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-amber-500/30'
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>

        
      </div>

      {/* Newsletter */}
      <NewLetterBox/>

      {/* Footer */}
      <Footer/>
    </div>
  )
}

export default Contact