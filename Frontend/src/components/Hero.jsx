import React from 'react'

function Hero({ heroData, heroCount, setHeroCount }) {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center px-8 md:px-16 relative'>
      
      {/* Hero Text Content */}
      <div className='max-w-2xl space-y-6'>
        
        {/* Subtitle */}
        <p className='text-violet-400 text-lg md:text-xl font-semibold uppercase tracking-wider'>
          {heroData.text1}
        </p>

        {/* Main Title */}
        <h1 className='text-white text-5xl md:text-7xl font-bold leading-tight'>
          {heroData.text2}
        </h1>

        {/* CTA Button */}
        <button 
          onClick={() => window.location.href = '/collection'}
          className='mt-8 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold text-lg rounded-lg shadow-lg shadow-violet-500/50 transition-all'
        >
          Shop Now
        </button>
      </div>

      {/* Carousel Dots */}
      <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3'>
        {[0, 1, 2, 3]. map((index) => (
          <button
            key={index}
            onClick={() => setHeroCount(index)}
            className={`transition-all rounded-full ${
              heroCount === index
                ? 'w-10 h-3 bg-violet-600'
                : 'w-3 h-3 bg-slate-600 hover:bg-slate-500'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default Hero