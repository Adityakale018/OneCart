import React from 'react'

function Hero({ heroData, heroCount, setHeroCount }) {
  return (
    <div className='w-full h-full flex flex-col items-start justify-center px-8 md:px-16 relative bg-[#fbe7eb]'>
      
      {/* Hero Text Content */}
      <div className='max-w-2xl space-y-6 z-10'>
        
        {/* Subtitle */}
        <p className='text-[#ff3f6c] text-lg md:text-xl font-bold uppercase tracking-widest'>
          {heroData.text1}
        </p>

        {/* Main Title */}
        <h1 className='text-gray-900 text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight'>
          {heroData.text2}
        </h1>

        <p className="text-gray-600 text-lg md:text-xl max-w-md pt-2">
          Discover the latest trends in fashion and explore our new collection.
        </p>

        {/* CTA Button */}
        <div className="pt-4">
          <button 
            onClick={() => window.location.href = '/collection'}
            className='px-10 py-4 bg-[#ff3f6c] hover:bg-[#e8365d] text-white font-bold text-lg rounded shadow-[0_8px_20px_rgba(255,63,108,0.3)] transition-all transform hover:-translate-y-1'
          >
            Explore Now
          </button>
        </div>
      </div>

      {/* Carousel Dots */}
      <div className='absolute bottom-8 left-8 md:left-16 flex items-center gap-2'>
        {[0, 1, 2, 3].map((index) => (
          <button
            key={index}
            onClick={() => setHeroCount(index)}
            className={`transition-all rounded-full ${
              heroCount === index
                ? 'w-8 h-2 bg-[#ff3f6c]'
                : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default Hero