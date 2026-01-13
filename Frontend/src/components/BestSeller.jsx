import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import { shopDataContext } from '../context/ShopContext'
import Card from './Card'

function BestSeller() {
  let {products} = useContext(shopDataContext)
  let [bestSeller, setBestSeller] = useState([])
  let [loading, setLoading] = useState(true)

  useEffect(() => {
    if(products.length > 0) {
      let filterProduct = products. filter((item) => item.bestseller)
      setBestSeller(filterProduct.slice(0, 8));
      setLoading(false)
    }
  }, [products])

  return (
    <div className='w-full py-20 bg-slate-950'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        
        {/* Header */}
        <div className='text-center mb-12'>
          <Title text1={"BEST "} text2={"SELLERS"}/>
          <p className='text-slate-400 text-lg mt-4 max-w-2xl mx-auto'>
            Tried, tested, loved - Discover our all-time bestsellers! 
          </p>
        </div>

        {loading ? (
          // Loading State
          <div className='flex items-center justify-center py-12'>
            <div className='w-12 h-12 border-4 border-violet-600/30 border-t-violet-600 rounded-full animate-spin'></div>
          </div>
        ) : bestSeller.length === 0 ? (
          // Empty State
          <div className='flex flex-col items-center justify-center py-20'>
            <div className='w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6'>
              <span className='text-5xl'>⭐</span>
            </div>
            <h3 className='text-white text-2xl font-bold mb-2'>No bestsellers yet</h3>
            <p className='text-slate-400 text-center'>Check out our latest collection instead!</p>
            <button 
              onClick={() => window.location.href = '/collection'}
              className='mt-6 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all'
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6'>
              {bestSeller. map((item, index) => (
                <div key={index} className='relative'>
                  <Card 
                    name={item.name} 
                    id={item._id} 
                    price={item.price} 
                    image={item.image1}
                  />
                  {/* Bestseller Badge */}
                  <div className='absolute top-2 right-2 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1'>
                    <span>⭐</span>
                    <span>Bestseller</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Optional: View More Button */}
            {bestSeller.length >= 8 && (
              <div className='text-center mt-12'>
                <button 
                  onClick={() => window.location.href = '/collection'}
                  className='px-8 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-violet-600 text-white font-semibold rounded-lg transition-all'
                >
                  View All Bestsellers
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default BestSeller