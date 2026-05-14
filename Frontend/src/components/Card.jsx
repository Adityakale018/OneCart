import React, { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { FaHeart, FaStar } from 'react-icons/fa'

function Card({name, image, id, price}) {
    const {currency} = useContext(shopDataContext)
    let navigate = useNavigate()
    
    return (
        <div 
            className='group w-full bg-white rounded transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] relative'
        >
            {/* Image Container */}
            <div className='relative w-full aspect-[3/4] bg-gray-100 overflow-hidden cursor-pointer' onClick={() => navigate(`/productdetail/${id}`)}>
                <img 
                    src={image} 
                    alt={name}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                />
                
                {/* Wishlist Icon */}
                <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-[#ff3f6c] hover:shadow-md transition-all shadow-sm">
                    <FaHeart className="w-4 h-4" />
                </button>
                
                {/* Rating Badge (Mocked) */}
                <div className="absolute bottom-3 left-3 bg-white/90 px-2 py-1 rounded flex items-center gap-1 text-[11px] font-bold text-gray-800 shadow-sm">
                    4.5 <FaStar className="w-3 h-3 text-green-600" /> | 1.2k
                </div>

                {/* Overlay on Hover (Desktop) */}
                <div className='hidden md:flex absolute bottom-0 left-0 right-0 p-3 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300'>
                    <button className='w-full py-2 bg-white border border-gray-300 text-gray-800 text-sm font-bold rounded hover:border-[#ff3f6c] hover:text-[#ff3f6c] transition-colors'>
                        QUICK VIEW
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className='p-3' onClick={() => navigate(`/productdetail/${id}`)}>
                <h3 className='text-gray-800 font-bold text-sm truncate'>
                    BrandName
                </h3>
                <p className='text-gray-500 text-sm mb-2 truncate'>
                    {name}
                </p>
                <div className="flex items-baseline gap-2">
                    <p className='text-gray-900 font-bold text-sm'>
                        {currency}{price}
                    </p>
                    <p className='text-gray-500 text-xs line-through'>
                        {currency}{(price * 1.3).toFixed(0)}
                    </p>
                    <p className='text-[#ff905a] text-xs font-bold'>
                        (30% OFF)
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Card