import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import { shopDataContext } from '../context/ShopContext'
import Card from './Card'

function LatestCollection() {
  const {products} = useContext(shopDataContext)
  const [latestProducts, setLatestProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if(products.length > 0) {
      setLatestProducts(products.slice(0, 10));
      setLoading(false)
    }
  }, [products])

  return (
    <div className='w-full py-20 bg-slate-950'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        
        {/* Header */}
        <div className='text-center mb-12'>
          <Title text1={"LATEST "} text2={"COLLECTIONS"}/>
          <p className='text-slate-400 text-lg mt-4 max-w-2xl mx-auto'>
            Step into style - New collection dropping this season!
          </p>
        </div>

        {loading ? (
          // Loading State
          <div className='flex items-center justify-center py-12'>
            <div className='w-12 h-12 border-4 border-violet-600/30 border-t-violet-600 rounded-full animate-spin'></div>
          </div>
        ) : latestProducts.length === 0 ? (
          // Empty State
          <div className='flex flex-col items-center justify-center py-20'>
            <div className='w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6'>
              <span className='text-5xl'>🛍️</span>
            </div>
            <h3 className='text-white text-2xl font-bold mb-2'>No products available</h3>
            <p className='text-slate-400 text-center'>Check back soon for new arrivals! </p>
          </div>
        ) : (
          // Products Grid
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6'>
            {latestProducts.map((item, index) => (
              <Card 
                key={index} 
                name={item.name} 
                image={item.image1} 
                id={item._id} 
                price={item.price}
              />
            ))}
          </div>
        )}

        {/* Optional: View All Button */}
        {! loading && latestProducts.length > 0 && (
          <div className='text-center mt-12'>
            <button 
              onClick={() => window.location.href = '/collection'}
              className='px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-violet-500/30'
            >
              View All Products
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default LatestCollection