import React from 'react'

function Title({text1, text2}) {
  return (
    <div className='inline-flex gap-2 items-center mb-6'>
      <h2 className='text-3xl md:text-4xl font-bold'>
        <span className='text-white'>{text1}</span>
        <span className='text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400'>{text2}</span>
      </h2>
      <div className='w-8 md:w-12 h-0.5 bg-gradient-to-r from-violet-600 to-purple-600'></div>
    </div>
  )
}

export default Title