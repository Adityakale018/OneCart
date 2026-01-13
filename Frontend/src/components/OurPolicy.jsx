import React from 'react'
import Title from './Title'
import { RiExchangeFundsLine } from "react-icons/ri";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { BiSupport } from "react-icons/bi";

function OurPolicy() {
  return (
    <div className='w-full py-20 bg-slate-950'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        
        {/* Header */}
        <div className='text-center mb-16'>
          <Title text1={"OUR "} text2={"POLICY"}/>
          <p className='text-slate-400 text-lg mt-4 max-w-2xl mx-auto'>
            Customer-friendly policies committed to your satisfaction and safety
          </p>
        </div>

        {/* Policy Cards */}
        <div className='grid md:grid-cols-3 gap-8'>
          
          {/* Easy Exchange */}
          <div className='bg-slate-900 border border-slate-800 rounded-lg p-8 text-center hover:border-violet-600 transition-colors group'>
            <div className='w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/30'>
              <RiExchangeFundsLine className='w-8 h-8 text-white'/>
            </div>
            <h3 className='text-white text-xl font-bold mb-3 group-hover:text-violet-400 transition-colors'>
              Easy Exchange
            </h3>
            <p className='text-slate-400 leading-relaxed'>
              Exchange made easy - quick, simple and customer-friendly process for your convenience.
            </p>
          </div>

          {/* 7 Days Return */}
          <div className='bg-slate-900 border border-slate-800 rounded-lg p-8 text-center hover:border-emerald-600 transition-colors group'>
            <div className='w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30'>
              <TbRosetteDiscountCheckFilled className='w-8 h-8 text-white'/>
            </div>
            <h3 className='text-white text-xl font-bold mb-3 group-hover:text-emerald-400 transition-colors'>
              7 Days Return Policy
            </h3>
            <p className='text-slate-400 leading-relaxed'>
              Shop with confidence - enjoy our hassle-free 7-day return guarantee on all purchases.
            </p>
          </div>

          {/* Customer Support */}
          <div className='bg-slate-900 border border-slate-800 rounded-lg p-8 text-center hover:border-amber-600 transition-colors group'>
            <div className='w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30'>
              <BiSupport className='w-8 h-8 text-white'/>
            </div>
            <h3 className='text-white text-xl font-bold mb-3 group-hover: text-amber-400 transition-colors'>
              Best Customer Support
            </h3>
            <p className='text-slate-400 leading-relaxed'>
              Trusted customer support available 24/7 - your satisfaction is our top priority.
            </p>
          </div>
        </div>

        {/* Optional:  Additional Info Banner */}
        <div className='mt-12 bg-gradient-to-r from-violet-600/10 to-purple-600/10 border border-violet-600/30 rounded-lg p-6 text-center'>
          <p className='text-violet-400 font-semibold'>
            💎 Premium quality products with verified authenticity guarantee
          </p>
        </div>
      </div>
    </div>
  )
}

export default OurPolicy