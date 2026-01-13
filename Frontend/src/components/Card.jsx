import React, { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'

function Card({name, image, id, price}) {
    const {currency} = useContext(shopDataContext)
    let navigate = useNavigate()
    
    return (
        <div 
            className='group w-full max-w-sm bg-slate-900 border border-slate-800 rounded-lg overflow-hidden cursor-pointer hover:border-violet-600 transition-all'
            onClick={() => navigate(`/productdetail/${id}`)}
        >
            {/* Image Container */}
            <div className='relative w-full aspect-square bg-slate-800 overflow-hidden'>
                <img 
                    src={image} 
                    alt={name}
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                />
                
                {/* Overlay on Hover */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'>
                    <div className='absolute bottom-4 left-0 right-0 text-center'>
                        <span className='px-4 py-2 bg-white/90 text-slate-900 text-sm font-semibold rounded-full'>
                            View Details
                        </span>
                    </div>
                </div>
            </div>

            {/* Product Info */}
            <div className='p-4'>
                <h3 className='text-white font-medium text-base mb-2 truncate group-hover:text-violet-400 transition-colors'>
                    {name}
                </h3>
                <p className='text-violet-400 font-bold text-lg'>
                    {currency}{price}
                </p>
            </div>
        </div>
    )
}

export default Card