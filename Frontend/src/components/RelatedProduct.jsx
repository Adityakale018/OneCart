import React, { useContext, useEffect, useState } from 'react'
import { shopDataContext } from '../context/ShopContext'
import Card from './Card'

function RelatedProduct({ category, subCategory, currentProductId }) {
    const { products } = useContext(shopDataContext)
    const [related, setRelated] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        if (products.length > 0) {
            let productsCopy = products.slice()
            productsCopy = productsCopy.filter((item) => category === item.category)
            productsCopy = productsCopy.filter((item) => subCategory === item.subCategory)
            productsCopy = productsCopy.filter((item) => currentProductId !== item._id)
            setRelated(productsCopy.slice(0, 5))
            setLoading(false)
        }
    }, [products, category, subCategory, currentProductId])

    if (loading) {
        return (
            <div className='w-full py-16 bg-white'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='text-left mb-8'>
                        <h2 className='text-2xl font-bold text-gray-900'>Similar <span className="text-[#ff3f6c]">Products</span></h2>
                    </div>
                    <div className='flex items-center justify-center py-12'>
                        <div className='w-10 h-10 border-4 border-[#ff3f6c]/20 border-t-[#ff3f6c] rounded-full animate-spin'></div>
                    </div>
                </div>
            </div>
        )
    }

    if (related.length === 0) {
        return null
    }

    return (
        <div className='w-full py-16 bg-white border-t border-gray-100'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                
                {/* Header */}
                <div className='flex items-end justify-between mb-8'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>Similar <span className="text-[#ff3f6c]">Products</span></h2>
                        <p className='text-gray-500 text-sm mt-1'>You might also like these items</p>
                    </div>
                </div>

                {/* Products Grid */}
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6'>
                    {related.map((item, index) => (
                        <Card 
                            key={index} 
                            id={item._id} 
                            name={item.name} 
                            price={item.price} 
                            image={item.image1}
                        />
                    ))}
                </div>

                {/* View All Link */}
                {related.length >= 5 && (
                    <div className='text-center mt-10'>
                        <button 
                            onClick={() => window.location.href = '/collection'}
                            className='px-6 py-2 bg-white border border-gray-300 hover:border-[#ff3f6c] hover:text-[#ff3f6c] text-gray-700 font-bold rounded shadow-sm transition-all'
                        >
                            View All Similar Products
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RelatedProduct