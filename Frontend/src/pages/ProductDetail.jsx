import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { shopDataContext } from '../context/ShopContext';
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FiShoppingCart, FiCheck } from "react-icons/fi";
import RelatedProduct from '../components/RelatedProduct';

function ProductDetail() {
    let {productId} = useParams();
    let {products, currency, addToCart} = useContext(shopDataContext)
    let navigate = useNavigate()
    let [productData, setProductData] = useState(false)
    const [image, setImage] = useState('')
    const [size, setSize] = useState('')
    const [activeTab, setActiveTab] = useState('description')
    const [addedToCart, setAddedToCart] = useState(false)

    const FetchProductData = async () => {
        products.map((item) => {
            if (item._id === productId) {
                setProductData(item)
                setImage(item. image1)
                return null;
            }
        })
    }

    useEffect(() => {
        FetchProductData()
        setSize('')
        setAddedToCart(false)
    }, [productId, products])

    const handleAddToCart = () => {
        if(! size) {
            alert('Please select a size')
            return
        }
        addToCart(productData._id, size)
        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 2000)
    }

  return productData ? (
    <div className='w-full min-h-screen bg-slate-950'>
      
      {/* Product Section */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12'>
        <div className='grid lg:grid-cols-2 gap-8 lg:gap-12'>
          
          {/* Left:  Images */}
          <div className='flex flex-col-reverse lg:flex-row gap-4'>
            
            {/* Thumbnail Gallery */}
            <div className='flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible'>
              {[productData.image1, productData. image2, productData.image3, productData.image4].map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setImage(img)}
                  className={`flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 bg-slate-800 rounded-lg overflow-hidden border-2 transition-all ${
                    image === img ? 'border-violet-600' : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Product ${idx + 1}`}
                    className='w-full h-full object-cover'
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className='flex-1 bg-slate-800 rounded-lg overflow-hidden border border-slate-700'>
              <img 
                src={image} 
                alt={productData. name}
                className='w-full h-full object-cover'
              />
            </div>
          </div>

          {/* Right: Product Info */}
          <div className='space-y-6'>
            
            {/* Product Name */}
            <div>
              <h1 className='text-3xl lg:text-4xl font-bold text-white mb-3'>
                {productData.name}
              </h1>
              
              {/* Rating */}
              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-1'>
                  <FaStar className='w-5 h-5 fill-yellow-400'/>
                  <FaStar className='w-5 h-5 fill-yellow-400'/>
                  <FaStar className='w-5 h-5 fill-yellow-400'/>
                  <FaStar className='w-5 h-5 fill-yellow-400'/>
                  <FaStarHalfAlt className='w-5 h-5 fill-yellow-400'/>
                </div>
                <span className='text-slate-400'>(123 reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className='text-3xl font-bold text-violet-400'>
              {currency}{productData.price}
            </div>

            {/* Description */}
            <p className='text-slate-300 leading-relaxed'>
              {productData.description} Stylish breathable fabric cotton shirt.  Easy to wash and super comfortable, designed for effortless style. 
            </p>

            {/* Size Selection */}
            <div>
              <label className='text-white font-semibold text-lg mb-3 block'>
                Select Size
              </label>
              <div className='flex flex-wrap gap-3'>
                {productData.sizes.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSize(item)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      item === size
                        ? 'bg-violet-600 text-white border-2 border-violet-600'
                        : 'bg-slate-800 text-slate-300 border-2 border-slate-700 hover:border-violet-600'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className='flex gap-3'>
              <button
                onClick={handleAddToCart}
                disabled={addedToCart}
                className='flex-1 h-14 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-violet-500/30'
              >
                {addedToCart ? (
                  <>
                    <FiCheck className='w-5 h-5' />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <FiShoppingCart className='w-5 h-5' />
                    Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  if(! size) {
                    alert('Please select a size')
                    return
                  }
                  addToCart(productData._id, size)
                  navigate('/cart')
                }}
                className='h-14 px-6 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors border border-slate-700'
              >
                Buy Now
              </button>
            </div>

            {/* Product Features */}
            <div className='bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-3'>
              <div className='flex items-center gap-3 text-slate-300'>
                <span className='text-emerald-400'>✓</span>
                <span>100% Original Product</span>
              </div>
              <div className='flex items-center gap-3 text-slate-300'>
                <span className='text-emerald-400'>✓</span>
                <span>Cash On Delivery Available</span>
              </div>
              <div className='flex items-center gap-3 text-slate-300'>
                <span className='text-emerald-400'>✓</span>
                <span>Easy Return & Exchange within 7 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Reviews Section */}
      <div className='bg-slate-900/50 border-t border-slate-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          
          {/* Tabs */}
          <div className='flex gap-2 mb-6 border-b border-slate-800'>
            <button
              onClick={() => setActiveTab('description')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'description'
                  ? 'text-violet-400 border-b-2 border-violet-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'reviews'
                  ? 'text-violet-400 border-b-2 border-violet-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Reviews (123)
            </button>
          </div>

          {/* Tab Content */}
          <div className='bg-slate-900 border border-slate-800 rounded-lg p-6'>
            {activeTab === 'description' ?  (
              <p className='text-slate-300 leading-relaxed text-lg'>
                Upgrade your wardrobe with this stylish slim-fit cotton shirt, available now on OneCart. 
                Crafted from breathable, high-quality fabric, it offers all-day comfort and effortless style. 
                Easy to maintain and perfect for any setting, this shirt is a must-have essential for those 
                who value both fashion and function.
              </p>
            ) : (
              <div className='text-slate-300'>
                <p className='text-center py-8'>Customer reviews coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className='bg-slate-950'>
        <RelatedProduct 
          category={productData.category} 
          subCategory={productData.subCategory} 
          currentProductId={productData._id} 
        />
      </div>
    </div>
  ) : (
    <div className='w-full min-h-screen bg-slate-950 flex items-center justify-center'>
      <div className='w-12 h-12 border-4 border-violet-600/30 border-t-violet-600 rounded-full animate-spin'></div>
    </div>
  )
}

export default ProductDetail