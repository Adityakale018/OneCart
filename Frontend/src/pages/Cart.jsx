import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiMinus, FiPlus } from "react-icons/fi";
import CartTotal from '../components/CartTotal';

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
    <div className='w-full min-h-screen bg-slate-950 overflow-x-hidden'>
      <div className='pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto'>
        
        {/* Header */}
        <div className='mb-8'>
          <Title text1={"YOUR "} text2={"CART"}/>
          <p className='text-slate-400 text-center mt-2'>
            {cartData.length} {cartData.length === 1 ? 'item' :  'items'} in your cart
          </p>
        </div>

        {cartData. length === 0 ? (
          // Empty Cart State
          <div className='flex flex-col items-center justify-center py-20'>
            <div className='w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6'>
              <span className='text-5xl'>🛒</span>
            </div>
            <h3 className='text-white text-2xl font-bold mb-2'>Your cart is empty</h3>
            <p className='text-slate-400 text-center mb-8'>Add some products to get started!</p>
            <button
              onClick={() => navigate('/collection')}
              className='px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-violet-500/30'
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className='flex flex-col lg:flex-row gap-6'>
            
            {/* Cart Items - Left Side */}
            <div className='flex-1 space-y-4'>
              {cartData.map((item, index) => {
                let productData = products.find((prod) => prod._id === item._id)
                if (!productData) return null;
                
                return (
                  <div 
                    key={index} 
                    className='bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-violet-600/50 transition-colors'
                  >
                    <div className='flex gap-4'>
                      
                      {/* Product Image */}
                      <div 
                        className='w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-slate-800 rounded-lg overflow-hidden cursor-pointer'
                        onClick={() => navigate(`/productdetail/${productData._id}`)}
                      >
                        <img 
                          src={productData.image1} 
                          alt={productData.name}
                          className='w-full h-full object-cover hover:scale-110 transition-transform duration-300'
                        />
                      </div>

                      {/* Product Info */}
                      <div className='flex-1 min-w-0'>
                        <h3 
                          className='text-white font-semibold text-base sm:text-lg mb-2 cursor-pointer hover:text-violet-400 transition-colors line-clamp-1'
                          onClick={() => navigate(`/productdetail/${productData._id}`)}
                        >
                          {productData.name}
                        </h3>
                        
                        <div className='flex flex-wrap items-center gap-2 sm:gap-4 mb-3'>
                          <p className='text-violet-400 font-bold text-lg sm:text-xl'>
                            {currency}{productData.price}
                          </p>
                          <div className='px-2 sm:px-3 py-1 bg-slate-800 border border-slate-700 rounded text-slate-300 text-xs sm:text-sm'>
                            Size: {item.size}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
                          <div className='flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg w-fit'>
                            <button
                              onClick={() => UpdateQuantity(item._id, item.size, item.quantity - 1)}
                              className='w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover: bg-slate-700 transition-colors rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed'
                              disabled={item.quantity <= 1}
                            >
                              <FiMinus />
                            </button>
                            <span className='w-10 text-center text-white font-semibold text-sm'>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => UpdateQuantity(item._id, item.size, item.quantity + 1)}
                              className='w-8 h-8 flex items-center justify-center text-slate-400 hover: text-white hover:bg-slate-700 transition-colors rounded-r-lg'
                            >
                              <FiPlus />
                            </button>
                          </div>

                          {/* Subtotal */}
                          <div className='text-slate-400 text-sm'>
                            Subtotal: <span className='text-white font-semibold'>{currency}{productData.price * item.quantity}</span>
                          </div>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => UpdateQuantity(item._id, item.size, 0)}
                        className='flex-shrink-0 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors self-start'
                        title='Remove from cart'
                      >
                        <RiDeleteBin6Line className='w-5 h-5' />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Order Summary - Right Side */}
            <div className='w-full lg:w-96 flex-shrink-0'>
              <div className='bg-slate-900 border border-slate-800 rounded-lg p-6 lg:sticky lg:top-24'>
                <h3 className='text-white text-xl font-bold mb-6'>Order Summary</h3>
                
                <div className='mb-6'>
                  <CartTotal />
                </div>

                <button
                  onClick={() => {
                    if (cartData. length > 0) {
                      navigate('/placeorder')
                    }
                  }}
                  disabled={cartData.length === 0}
                  className='w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled: cursor-not-allowed shadow-lg shadow-violet-500/30'
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate('/collection')}
                  className='w-full mt-3 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors border border-slate-700'
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart