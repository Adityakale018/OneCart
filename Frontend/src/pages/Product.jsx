import React from 'react'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'

function Product() {
  return (
    <div className='w-full bg-white'>
      <LatestCollection />
      <BestSeller />
    </div>
  )
}

export default Product