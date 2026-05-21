import React, { useContext, useEffect, useState } from 'react'
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { FaTimes } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import CartTotal from '../components/CartTotal';
import SharedCartPanel from '../components/SharedCartPanel';

function Cart() {
    const {products, cartItem, UpdateQuantity, currency} = useContext(shopDataContext)
    const [cartData, setCartData] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
      let tempData = [];
      for(const items in cartItem){
        for(const item in cartItem[items]){
            if(cartItem[items][item] > 0){
                tempData.push({
                    _id: items,  
                    size: item,
                    quantity: cartItem[items][item]
                })
            }
        }
      }
      setCartData(tempData);
    }, [cartItem])

  return (
    <div className='w-full min-h-screen bg-[#f5f5f6] overflow-x-hidden pb-28 md:pb-16'>
      <div className='pt-8 md:pt-12 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto'>
        
        {cartData.length === 0 ? (
          // Empty Cart State
          <div className='flex flex-col items-center justify-center py-20 bg-white shadow-sm mt-4 rounded'>
            <div className='w-32 h-32 mb-6'>
                <img src="https://constant.myntassets.com/checkout/assets/img/empty-bag.webp" alt="Empty Bag" className="w-full h-full object-contain" />
            </div>
            <h3 className='text-gray-800 text-xl font-bold mb-2'>Hey, it feels so light!</h3>
            <p className='text-gray-500 text-sm mb-8'>There is nothing in your bag. Let's add some items.</p>
            <button
              onClick={() => navigate('/collection')}
              className='px-8 py-3 bg-white border border-[#ff3f6c] text-[#ff3f6c] hover:bg-[#ff3f6c] hover:text-white font-bold rounded uppercase tracking-wide transition-colors'
            >
              Add Items from Wishlist
            </button>
          </div>
        ) : (
          <div className='flex flex-col lg:flex-row gap-6 mt-4'>
            
            {/* Cart Items - Left Side */}
            <div className='flex-1 space-y-4'>
              {/* Delivery Address Banner */}
              <div className="bg-white p-4 rounded shadow-sm border border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-800">
                      Deliver to: <span className="font-bold">New Delhi - 110001</span>
                  </div>
                  <button className="text-[#ff3f6c] text-sm font-bold border border-[#ff3f6c] px-3 py-1 rounded">CHANGE</button>
              </div>

              {/* Offers Banner */}
              <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-800 text-sm mb-1 flex items-center gap-2">
                     Available Offers
                  </h4>
                  <ul className="text-gray-600 text-xs list-disc pl-4 space-y-1 mt-2">
                      <li>10% Instant Discount on SBI Credit Cards on a min spend of {currency}3,000.</li>
                      <li>Flat {currency}200 Cashback on first order.</li>
                  </ul>
              </div>

              {/* Items List */}
              <div className="bg-white shadow-sm border border-gray-100 rounded p-4">
                  <div className="flex justify-between items-center mb-4 text-sm">
                      <span className="font-bold text-gray-800">{cartData.length} Items selected</span>
                  </div>

                  <div className="space-y-4">
                    {cartData.map((item, index) => {
                      let productData = products.find((prod) => prod._id === item._id)
                      if (!productData) return null;
                      
                      return (
                        <div 
                          key={index} 
                          className='relative flex gap-4 p-4 border border-gray-200 rounded hover:shadow-sm transition-shadow bg-white'
                        >
                          {/* Product Image */}
                          <div 
                            className='w-[100px] h-[130px] flex-shrink-0 bg-gray-100 cursor-pointer'
                            onClick={() => navigate(`/productdetail/${productData._id}`)}
                          >
                            <img 
                              src={productData.image1} 
                              alt={productData.name}
                              className='w-full h-full object-cover'
                            />
                          </div>

                          {/* Product Info */}
                          <div className='flex-1 min-w-0 pr-6'>
                            <h3 
                              className='text-gray-900 font-bold text-sm mb-1 cursor-pointer hover:text-[#ff3f6c] transition-colors truncate'
                              onClick={() => navigate(`/productdetail/${productData._id}`)}
                            >
                              BrandName
                            </h3>
                            <p className="text-gray-500 text-sm truncate mb-2">{productData.name}</p>
                            
                            {/* Controls row */}
                            <div className="flex flex-wrap items-center gap-4 mb-3">
                                {/* Size */}
                                <div className="bg-gray-100 text-gray-800 text-sm font-bold px-2 py-1 rounded flex items-center gap-1 cursor-pointer">
                                    Size: {item.size}
                                </div>

                                {/* Quantity Controls */}
                                <div className='flex items-center gap-3 bg-gray-100 rounded px-2 py-1 w-fit'>
                                    <span className="text-sm font-bold text-gray-800">Qty:</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                        onClick={() => UpdateQuantity(item._id, item.size, item.quantity - 1)}
                                        className='text-gray-500 hover:text-gray-800 disabled:opacity-50'
                                        disabled={item.quantity <= 1}
                                        >
                                        <FiMinus className="w-3 h-3" />
                                        </button>
                                        <span className='text-gray-800 font-bold text-sm'>
                                        {item.quantity}
                                        </span>
                                        <button
                                        onClick={() => UpdateQuantity(item._id, item.size, item.quantity + 1)}
                                        className='text-gray-500 hover:text-gray-800'
                                        >
                                        <FiPlus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className='flex items-baseline gap-2 mb-3'>
                              <p className='text-gray-900 font-bold text-sm'>
                                {currency}{productData.price * item.quantity}
                              </p>
                              <p className='text-gray-500 text-xs line-through'>
                                {currency}{(productData.price * item.quantity * 1.3).toFixed(0)}
                              </p>
                              <p className='text-[#ff905a] text-xs font-bold'>
                                30% OFF
                              </p>
                            </div>

                            <p className="text-xs text-gray-500 flex items-center gap-1"><span className="text-green-600 font-bold">14 days</span> return available</p>
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() => UpdateQuantity(item._id, item.size, 0)}
                            className='absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors'
                            title='Remove from cart'
                          >
                            <FaTimes className='w-4 h-4' />
                          </button>
                        </div>
                      )
                    })}
                  </div>
              </div>
            </div>

            {/* Order Summary - Right Side */}
            <div className='w-full lg:w-[350px] flex-shrink-0'>
              <div className='bg-white border border-gray-100 shadow-sm rounded p-4 lg:sticky lg:top-[100px]'>
                
                <div className='mb-4'>
                  <CartTotal />
                </div>

                <button
                  onClick={() => {
                    if (cartData.length > 0) {
                      navigate('/placeorder')
                    }
                  }}
                  disabled={cartData.length === 0}
                  className='w-full py-3 bg-[#ff3f6c] hover:bg-[#e8365d] text-white font-bold rounded shadow-[0_2px_4px_rgba(255,63,108,0.2)] uppercase tracking-wide transition-colors disabled:opacity-50'
                >
                  PLACE ORDER
                </button>
                {/* Shared Cart Panel */}
                <SharedCartPanel />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart