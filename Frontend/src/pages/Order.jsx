import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import { shopDataContext } from '../context/ShopContext'
import { authDataContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Order() {
  let [orderData, setOrderData] = useState([])
  let [loading, setLoading] = useState(true)
  let {serverUrl, currency} = useContext(shopDataContext)
  let navigate = useNavigate()

  const loadOrderData = async () => {
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/order/userorder", {}, {withCredentials: true})
      if(result.data){
        let allOrdersItem = []
        result.data.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status
            item['payment'] = order. payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order. date
            item['orderId'] = order._id
            allOrdersItem. push(item)
          })
        })
        setOrderData(allOrdersItem.reverse())
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [])

  const getStatusColor = (status) => {
    switch(status?. toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-500'
      case 'shipped':
      case 'out for delivery':
        return 'bg-blue-500'
      case 'processing':
      case 'order placed':
        return 'bg-yellow-500'
      case 'cancelled':
        return 'bg-red-500'
      default:
        return 'bg-violet-500'
    }
  }

  return (
    <div className='w-full min-h-screen bg-slate-950 pt-24 pb-20 md:pb-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg: px-8'>
        
        {/* Header */}
        <div className='text-center mb-8'>
          <Title text1={"MY "} text2={"ORDERS"}/>
          <p className='text-slate-400 mt-2'>
            {orderData.length} {orderData.length === 1 ? 'order' : 'orders'} found
          </p>
        </div>

        {loading ? (
          // Loading State
          <div className='flex items-center justify-center py-20'>
            <div className='w-12 h-12 border-4 border-violet-600/30 border-t-violet-600 rounded-full animate-spin'></div>
          </div>
        ) : orderData.length === 0 ?  (
          // Empty State
          <div className='flex flex-col items-center justify-center py-20'>
            <div className='w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6'>
              <span className='text-5xl'>📦</span>
            </div>
            <h3 className='text-white text-2xl font-bold mb-2'>No orders yet</h3>
            <p className='text-slate-400 text-center mb-8'>Start shopping to see your orders here! </p>
            <button
              onClick={() => navigate('/collection')}
              className='px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all'
            >
              Start Shopping
            </button>
          </div>
        ) : (
          // Orders List
          <div className='space-y-4'>
            {orderData.map((item, index) => (
              <div 
                key={index} 
                className='bg-slate-900 border border-slate-800 rounded-lg p-4 md:p-6 hover:border-violet-600/50 transition-colors'
              >
                <div className='flex flex-col md:flex-row gap-4'>
                  
                  {/* Product Image */}
                  <div 
                    className='w-full md:w-32 h-32 flex-shrink-0 bg-slate-800 rounded-lg overflow-hidden cursor-pointer'
                    onClick={() => navigate(`/productdetail/${item._id}`)}
                  >
                    <img 
                      src={item.image1} 
                      alt={item.name}
                      className='w-full h-full object-cover hover:scale-110 transition-transform duration-300'
                    />
                  </div>

                  {/* Order Details */}
                  <div className='flex-1 space-y-3'>
                    
                    {/* Product Name */}
                    <h3 
                      className='text-white font-semibold text-lg cursor-pointer hover:text-violet-400 transition-colors'
                      onClick={() => navigate(`/productdetail/${item._id}`)}
                    >
                      {item.name}
                    </h3>

                    {/* Price, Quantity, Size */}
                    <div className='flex flex-wrap items-center gap-4 text-sm'>
                      <div className='flex items-center gap-2'>
                        <span className='text-slate-500'>Price:</span>
                        <span className='text-violet-400 font-semibold'>{currency}{item.price}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-slate-500'>Quantity:</span>
                        <span className='text-white'>{item.quantity}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-slate-500'>Size:</span>
                        <span className='px-2 py-1 bg-slate-800 text-white rounded text-xs'>{item.size}</span>
                      </div>
                    </div>

                    {/* Date & Payment */}
                    <div className='flex flex-wrap items-center gap-4 text-sm text-slate-400'>
                      <div className='flex items-center gap-2'>
                        <span>📅</span>
                        <span>{new Date(item.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span>💳</span>
                        <span className='capitalize'>{item.paymentMethod}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className='flex items-center gap-2'>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`}></div>
                      <span className='text-white font-medium capitalize'>{item.status}</span>
                    </div>
                  </div>

                  {/* Track Order Button */}
                  <div className='flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2'>
                    <button
                      onClick={loadOrderData}
                      className='px-4 py-2 bg-slate-800 hover:bg-violet-600 text-white text-sm font-semibold rounded-lg transition-colors'
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Order
