import React, { useContext, useEffect, useState } from 'react'
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { FaHeart, FaStar } from 'react-icons/fa'
import { FiArrowRight } from 'react-icons/fi'

function BestSeller() {
  const { products, currency } = useContext(shopDataContext)
  const [bestSeller, setBestSeller] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter((item) => item.bestseller)
      setBestSeller(filtered.slice(0, 8))
      setLoading(false)
    }
  }, [products])

  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">⭐ Customer Favourites</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Best <span className="text-[#ff3f6c]">Sellers</span>
            </h2>
            <p className="text-gray-500 text-sm mt-1">Tried, tested, loved — our all-time bestsellers!</p>
          </div>
          <button
            onClick={() => navigate('/collection')}
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-[#ff3f6c] border border-[#ff3f6c] rounded-lg px-4 py-2 hover:bg-[#ff3f6c] hover:text-white transition-colors"
          >
            View All <FiArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#ff3f6c]/20 border-t-[#ff3f6c] rounded-full animate-spin" />
          </div>
        ) : bestSeller.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="text-5xl mb-4">⭐</span>
            <h3 className="font-bold text-gray-700 text-lg mb-2">No bestsellers yet</h3>
            <p className="text-gray-500 text-sm mb-6">Check out our latest collection instead!</p>
            <button
              onClick={() => navigate('/collection')}
              className="px-6 py-2.5 bg-[#ff3f6c] text-white font-bold rounded-lg text-sm hover:bg-[#e8365d] transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {bestSeller.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/productdetail/${item._id}`)}
                  className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  {/* Bestseller ribbon */}
                  <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    ⭐ BESTSELLER
                  </div>
                  {/* Image */}
                  <div className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden">
                    <img
                      src={item.image1} alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-2.5 right-2.5 w-7 h-7 bg-white rounded-full flex items-center justify-center text-gray-300 hover:text-[#ff3f6c] shadow-sm transition-colors"
                    >
                      <FaHeart className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-white/90 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-800 flex items-center gap-1 shadow-sm">
                      4.5 <FaStar className="w-2.5 h-2.5 text-green-600" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-white py-2 text-center text-xs font-bold text-gray-700 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                      QUICK VIEW
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-3">
                    <p className="text-xs font-bold text-gray-800 truncate">
                      {item.name?.includes(' | ') ? item.name.split(' | ')[0] : 'OneCart'}
                    </p>
                    <p className="text-xs text-gray-500 truncate mb-1.5">
                      {item.name?.includes(' | ') ? item.name.split(' | ')[1] : item.name}
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-gray-900">{currency}{item.price}</span>
                      <span className="text-xs text-gray-400 line-through">{currency}{Math.round(item.price * 1.3)}</span>
                      <span className="text-xs font-bold text-[#ff905a]">30% off</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="sm:hidden text-center mt-8">
              <button
                onClick={() => navigate('/collection')}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#ff3f6c] border border-[#ff3f6c] rounded-lg px-6 py-2.5 hover:bg-[#ff3f6c] hover:text-white transition-colors"
              >
                View All Bestsellers <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default BestSeller