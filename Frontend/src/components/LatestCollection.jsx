import React, { useContext, useEffect, useState } from 'react'
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { FaHeart, FaStar } from 'react-icons/fa'
import { FiArrowRight } from 'react-icons/fi'

function LatestCollection() {
  const { products, currency } = useContext(shopDataContext)
  const [latestProducts, setLatestProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (products.length > 0) {
      setLatestProducts(products.slice(0, 10))
      setLoading(false)
    }
  }, [products])

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-[#ff3f6c] uppercase tracking-widest">New Arrivals</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Latest <span className="text-[#ff3f6c]">Collections</span>
            </h2>
            <p className="text-gray-500 text-sm mt-1">Step into style — fresh drops this season!</p>
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
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {latestProducts.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/productdetail/${item._id}`)}
                  className="group bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
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
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-800 flex items-center gap-1 shadow-sm">
                      4.5 <FaStar className="w-2.5 h-2.5 text-green-600" />
                    </div>
                    {/* Hover quick view */}
                    <div className="absolute inset-x-0 bottom-0 bg-white py-2 text-center text-xs font-bold text-gray-700 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                      QUICK VIEW
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-3">
                    <p className="text-xs font-bold text-gray-800 truncate">BrandName</p>
                    <p className="text-xs text-gray-500 truncate mb-1.5">{item.name}</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-gray-900">{currency}{item.price}</span>
                      <span className="text-xs text-gray-400 line-through">{currency}{Math.round(item.price * 1.3)}</span>
                      <span className="text-xs font-bold text-[#ff905a]">30% off</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile view-all */}
            <div className="sm:hidden text-center mt-8">
              <button
                onClick={() => navigate('/collection')}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#ff3f6c] border border-[#ff3f6c] rounded-lg px-6 py-2.5 hover:bg-[#ff3f6c] hover:text-white transition-colors"
              >
                View All <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default LatestCollection