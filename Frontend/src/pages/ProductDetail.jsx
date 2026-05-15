import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { shopDataContext } from '../context/ShopContext';
import { FaStar, FaStarHalfAlt, FaRegHeart } from "react-icons/fa";
import { FiShoppingCart, FiCheck, FiUsers } from "react-icons/fi";
import axios from "axios";
import RelatedProduct from '../components/RelatedProduct';

function ProductDetail() {
    let {productId} = useParams();
    let {products, currency, addToCart, serverUrl} = useContext(shopDataContext)
    let navigate = useNavigate()
    let [productData, setProductData] = useState(false)
    const [image, setImage] = useState('')
    const [size, setSize] = useState('')
    const [activeTab, setActiveTab] = useState('description')
    const [addedToCart, setAddedToCart] = useState(false)
    const [addedToShared, setAddedToShared] = useState(false)
    const activeSharedCartId = localStorage.getItem("activeSharedCartId");

    const FetchProductData = async () => {
        products.map((item) => {
            if (item._id === productId) {
                setProductData(item)
                setImage(item.image1)
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
        if(!size) {
            alert('Please select a size')
            return
        }
        addToCart(productData._id, size)
        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 2000)
    }

    const handleAddToSharedCart = async () => {
        if(!size) {
            alert('Please select a size')
            return
        }
        try {
            await axios.post(`${serverUrl}/api/sharedcart/${activeSharedCartId}/item`, { productId: productData._id, size, quantity: 1 }, { withCredentials: true });
            setAddedToShared(true);
            setTimeout(() => {
                setAddedToShared(false);
                navigate(`/shared-cart/${activeSharedCartId}`);
            }, 1000);
        } catch(e) {
            console.error(e);
            alert('Failed to add to shared cart');
        }
    }

  return productData ? (
    <div className='w-full min-h-screen bg-white'>
      
      {/* Product Section */}
      <div className='max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12'>
        {/* Breadcrumb could go here */}
        <div className="text-sm text-gray-500 mb-4 cursor-pointer">
            Home / {productData.category} / <span className="font-semibold text-gray-800">{productData.name}</span>
        </div>

        <div className='grid lg:grid-cols-2 gap-8 lg:gap-12'>
          
          {/* Left: Images */}
          <div className='flex flex-col-reverse lg:flex-row gap-4'>
            
            {/* Thumbnail Gallery */}
            <div className='flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible scrollbar-hide'>
              {[productData.image1, productData.image2, productData.image3, productData.image4].map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setImage(img)}
                  className={`flex-shrink-0 w-[70px] h-[90px] lg:w-[80px] lg:h-[105px] bg-gray-100 overflow-hidden border-2 transition-all ${
                    image === img ? 'border-[#ff3f6c]' : 'border-transparent hover:border-gray-300'
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
            <div className='flex-1 bg-gray-100 overflow-hidden cursor-zoom-in'>
              <img 
                src={image} 
                alt={productData.name}
                className='w-full h-full object-cover aspect-[3/4]'
              />
            </div>
          </div>

          {/* Right: Product Info */}
          <div className='space-y-6 pt-2'>
            
            {/* Product Name */}
            <div>
              <h1 className='text-2xl font-bold text-gray-900 mb-1'>
                Brand Name
              </h1>
              <p className='text-gray-500 text-lg mb-3'>{productData.name}</p>
              
              {/* Rating */}
              <div className='flex items-center gap-3'>
                <div className='flex items-center border border-gray-200 px-2 py-1 rounded gap-1 cursor-pointer hover:border-gray-300'>
                  <span className="text-sm font-bold text-gray-800">4.5</span>
                  <FaStar className='w-3.5 h-3.5 text-green-600'/>
                  <span className='text-gray-400 pl-1 border-l border-gray-300 text-sm'>1.2k Ratings</span>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Price */}
            <div>
                <div className='flex items-baseline gap-3'>
                    <span className='text-2xl font-bold text-gray-900'>
                        {currency}{productData.price}
                    </span>
                    <span className='text-xl text-gray-500 line-through'>
                        {currency}{(productData.price * 1.3).toFixed(0)}
                    </span>
                    <span className='text-xl font-bold text-[#ff905a]'>
                        (30% OFF)
                    </span>
                </div>
                <p className="text-[#03a685] font-bold text-sm mt-1">inclusive of all taxes</p>
            </div>

            {/* Size Selection */}
            <div className="pt-2">
              <div className='flex items-center justify-between mb-3'>
                <label className='text-gray-900 font-bold text-base block'>
                    SELECT SIZE
                </label>
                <button className="text-[#ff3f6c] text-sm font-bold uppercase tracking-wide">Size Chart</button>
              </div>
              <div className='flex flex-wrap gap-3'>
                {productData.sizes.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSize(item)}
                    className={`w-12 h-12 rounded-full font-bold text-sm transition-all flex items-center justify-center ${
                      item === size
                        ? 'border-2 border-[#ff3f6c] text-[#ff3f6c]'
                        : 'border border-gray-300 text-gray-800 hover:border-[#ff3f6c]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-4 pt-4'>
              <button
                onClick={handleAddToCart}
                disabled={addedToCart}
                className='flex-1 h-14 bg-[#ff3f6c] hover:bg-[#e8365d] text-white font-bold rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-80'
              >
                {addedToCart ? (
                  <>
                    <FiCheck className='w-5 h-5' />
                    ADDED
                  </>
                ) : (
                  <>
                    <FiShoppingCart className='w-5 h-5' />
                    ADD TO BAG
                  </>
                )}
              </button>
              {activeSharedCartId ? (
                  <button 
                    onClick={handleAddToSharedCart}
                    disabled={addedToShared}
                    className='flex-1 h-14 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-80'
                  >
                    {addedToShared ? (
                        <>
                            <FiCheck className='w-5 h-5' />
                            ADDED
                        </>
                    ) : (
                        <>
                            <FiUsers className="w-5 h-5" />
                            ADD TO SHARED CART
                        </>
                    )}
                  </button>
              ) : (
                  <button className='flex-1 h-14 bg-white border border-gray-300 hover:border-gray-400 text-gray-800 font-bold rounded flex items-center justify-center gap-2 transition-colors'>
                    <FaRegHeart className="w-5 h-5" />
                    WISHLIST
                  </button>
              )}
            </div>

            <hr className="border-gray-200 my-6" />

            {/* Product Features */}
            <div className='space-y-4'>
                <h4 className="font-bold text-gray-900 flex items-center gap-2">DELIVERY OPTIONS</h4>
                <div className="relative max-w-sm">
                    <input type="text" placeholder="Enter pincode" className="w-full border border-gray-300 rounded p-3 pr-20 text-sm focus:outline-none focus:border-gray-400" />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ff3f6c] font-bold text-sm">Check</button>
                </div>
                <p className="text-sm text-gray-500">Please enter PIN code to check delivery time & Pay on Delivery Availability</p>
                <div className='space-y-2 pt-2'>
                    <div className='flex items-center gap-2 text-gray-700 text-sm'>
                        <span className='w-5'>🚚</span>
                        <span>Get it by {new Date(Date.now() + 86400000 * 3).toLocaleDateString()}</span>
                    </div>
                    <div className='flex items-center gap-2 text-gray-700 text-sm'>
                        <span className='w-5'>💵</span>
                        <span>Pay on delivery available</span>
                    </div>
                    <div className='flex items-center gap-2 text-gray-700 text-sm'>
                        <span className='w-5'>🔄</span>
                        <span>Easy 14 days return & exchange available</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Description & Reviews Section */}
      <div className='bg-white'>
        <div className='max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          
          {/* Tabs */}
          <div className='flex gap-8 mb-6 border-b border-gray-200'>
            <button
              onClick={() => setActiveTab('description')}
              className={`py-3 font-bold text-sm tracking-wide uppercase transition-colors relative ${
                activeTab === 'description'
                  ? 'text-[#ff3f6c]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Product Details
              {activeTab === 'description' && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#ff3f6c]"></div>}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-3 font-bold text-sm tracking-wide uppercase transition-colors relative ${
                activeTab === 'reviews'
                  ? 'text-[#ff3f6c]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Reviews
              {activeTab === 'reviews' && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#ff3f6c]"></div>}
            </button>
          </div>

          {/* Tab Content */}
          <div className='py-4 max-w-3xl'>
            {activeTab === 'description' ?  (
              <div>
                <p className='text-gray-700 leading-relaxed text-sm'>
                  {productData.description || "Upgrade your wardrobe with this stylish slim-fit cotton shirt, available now on OneCart. Crafted from breathable, high-quality fabric, it offers all-day comfort and effortless style. Easy to maintain and perfect for any setting, this shirt is a must-have essential for those who value both fashion and function."}
                </p>
                <div className="mt-6 grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <div>
                        <span className="text-gray-500 block mb-1">Fit</span>
                        <span className="text-gray-900 font-medium">Regular Fit</span>
                    </div>
                    <div>
                        <span className="text-gray-500 block mb-1">Fabric</span>
                        <span className="text-gray-900 font-medium">100% Cotton</span>
                    </div>
                    <div>
                        <span className="text-gray-500 block mb-1">Occasion</span>
                        <span className="text-gray-900 font-medium">Casual</span>
                    </div>
                    <div>
                        <span className="text-gray-500 block mb-1">Wash Care</span>
                        <span className="text-gray-900 font-medium">Machine Wash</span>
                    </div>
                </div>
              </div>
            ) : (
              <div className='text-gray-500'>
                <p className='py-4'>Customer reviews coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className='bg-white max-w-[1600px] mx-auto'>
        <RelatedProduct 
          category={productData.category} 
          subCategory={productData.subCategory} 
          currentProductId={productData._id} 
        />
      </div>
    </div>
  ) : (
    <div className='w-full min-h-screen bg-white flex items-center justify-center'>
      <div className='w-10 h-10 border-4 border-[#ff3f6c]/30 border-t-[#ff3f6c] rounded-full animate-spin'></div>
    </div>
  )
}

export default ProductDetail