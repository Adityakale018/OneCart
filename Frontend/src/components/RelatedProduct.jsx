import React, { useContext, useEffect, useState } from 'react'
import { shopDataContext } from '../context/ShopContext'
import Title from './Title'
import Card from './Card'

function RelatedProduct({category, subCategory, currentProductId}) {
    let {products} = useContext(shopDataContext)
    let [related, setRelated] = useState([])
    let [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        if(products.length > 0){
            let productsCopy = products.slice()
            productsCopy = productsCopy.filter((item) => category === item.category)
            productsCopy = productsCopy.filter((item) => subCategory === item.subCategory)
            productsCopy = productsCopy.filter((item) => currentProductId !== item._id)
            setRelated(productsCopy. slice(0, 5))
            setLoading(false)
        }
    }, [products, category, subCategory, currentProductId])

    if(loading) {
        return (
            <div className='w-full py-20 bg-slate-950'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='text-center mb-12'>
                        <Title text1={"RELATED "} text2={"PRODUCTS"}/>
                    </div>
                    <div className='flex items-center justify-center py-12'>
                        <div className='w-12 h-12 border-4 border-violet-600/30 border-t-violet-600 rounded-full animate-spin'></div>
                    </div>
                </div>
            </div>
        )
    }

    if(related.length === 0) {
        return null
    }

    return (
        <div className='w-full py-20 bg-slate-950'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                
                {/* Header */}
                <div className='text-center mb-12'>
                    <Title text1={"RELATED "} text2={"PRODUCTS"}/>
                    <p className='text-slate-400 mt-2'>You might also like these items</p>
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

                {/* Optional: View All Link */}
                {related.length >= 5 && (
                    <div className='text-center mt-12'>
                        <button 
                            onClick={() => window.location.href = '/collection'}
                            className='px-8 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-violet-600 text-white font-semibold rounded-lg transition-all'
                        >
                            View All Products
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RelatedProduct