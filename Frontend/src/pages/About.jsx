import React from 'react'
import Title from '../components/Title'
import Aboutimg from "../assets/About.png"
import NewLetterBox from '../components/NewLetterBox'
import Footer from '../components/Footer'

function About() {
  return (
    <div className='w-full min-h-screen bg-slate-950 pt-24'>
      <div className='max-w-7xl mx-auto px-6 md:px-8 pb-16'>
        
        {/* Header */}
        <div className='text-center mb-16'>
          <Title text1={"ABOUT "} text2={"US"}/>
          <p className='text-slate-400 text-lg mt-4 max-w-2xl mx-auto'>
            Your trusted destination for quality products and great shopping experiences.
          </p>
        </div>

        {/* Story Section */}
        <div className='grid lg:grid-cols-2 gap-12 items-center mb-24'>
          
          {/* Image */}
          <div className='flex justify-center'>
            <div className='relative'>
              <img 
                src={Aboutimg} 
                alt="About OneCart" 
                className='w-full max-w-md rounded-lg shadow-lg'
              />
              <div className='absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg -z-10'></div>
            </div>
          </div>

          {/* Content */}
          <div className='space-y-6'>
            <p className='text-slate-300 text-base leading-relaxed'>
              OneCart was born for smart, seamless shopping – created to deliver quality products, trending styles, and everyday essentials in one place. With reliable service, fast delivery, and great value, OneCart makes your online shopping experience simple, satisfying, and stress-free. 
            </p>
            <p className='text-slate-300 text-base leading-relaxed'>
              Designed for modern shoppers – combining style, convenience, and affordability. Whether it's fashion, essentials, or trends, we bring everything you need to one trusted platform with fast delivery, easy returns, and a customer-first shopping experience you'll love. 
            </p>

            {/* Mission */}
            <div className='mt-8 pt-6 border-t border-slate-800'>
              <h3 className='text-white text-xl font-bold mb-3'>Our Mission</h3>
              <p className='text-slate-300 text-base leading-relaxed'>
                Our mission is to redefine online shopping by delivering quality, affordability, and convenience. OneCart connects customers with trusted products and brands, offering a seamless, customer-focused experience that saves time, adds value, and fits every lifestyle and need.  
              </p>
            </div>

            {/* Quick Stats */}
            <div className='grid grid-cols-3 gap-4 mt-8'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-violet-400'>50K+</div>
                <div className='text-slate-500 text-sm'>Products</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-violet-400'>100K+</div>
                <div className='text-slate-500 text-sm'>Customers</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-violet-400'>4.8★</div>
                <div className='text-slate-500 text-sm'>Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className='mb-20'>
          <div className='text-center mb-12'>
            <Title text1={"WHY "} text2={"CHOOSE US"}/>
            <p className='text-slate-400 mt-4'>What makes OneCart different</p>
          </div>

          <div className='grid md: grid-cols-3 gap-6'>
            
            {/* Card 1 - Quality */}
            <div className='bg-slate-900 border border-slate-800 rounded-lg p-8 hover:border-violet-600 transition-colors group'>
              <div className='w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-violet-500/30'>
                <span className='text-2xl'>✓</span>
              </div>
              <h3 className='text-white text-xl font-bold mb-3 group-hover:text-violet-400 transition-colors'>Quality Assurance</h3>
              <p className='text-slate-400 leading-relaxed'>
                We guarantee quality through strict checks, reliable sourcing and a commitment to customer satisfaction always. 
              </p>
            </div>

            {/* Card 2 - Convenience */}
            <div className='bg-slate-900 border border-slate-800 rounded-lg p-8 hover: border-emerald-600 transition-colors group'>
              <div className='w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30'>
                <span className='text-2xl'>⚡</span>
              </div>
              <h3 className='text-white text-xl font-bold mb-3 group-hover:text-emerald-400 transition-colors'>Convenience</h3>
              <p className='text-slate-400 leading-relaxed'>
                Shop easily with fast delivery, simple navigation, secure checkout and everything you need in one place.
              </p>
            </div>

            {/* Card 3 - Service */}
            <div className='bg-slate-900 border border-slate-800 rounded-lg p-8 hover:border-amber-600 transition-colors group'>
              <div className='w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-amber-500/30'>
                <span className='text-2xl'>💬</span>
              </div>
              <h3 className='text-white text-xl font-bold mb-3 group-hover:text-amber-400 transition-colors'>Exceptional Service</h3>
              <p className='text-slate-400 leading-relaxed'>
                Our dedicated support team is here to assist you every step of the way, ensuring a smooth shopping experience. 
              </p>
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

export default About