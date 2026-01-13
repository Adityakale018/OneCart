import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav'
import Sidebar from '../components/Sidebar'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { FiPackage, FiMapPin, FiCreditCard, FiCalendar, FiUser } from "react-icons/fi";

function Orders() {
  let [orders, setOrders] = useState([])
  let [filteredOrders, setFilteredOrders] = useState([])
  let [filterStatus, setFilterStatus] = useState('All')
  let [loading, setLoading] = useState(true)
  let {serverUrl} = useContext(authDataContext)

  const fetchAllOrders = async () => {
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/order/list", {}, {
        withCredentials: true
      })
      setOrders(result.data.reverse())
      setFilteredOrders(result.data. reverse())
    } catch (error) {
      console.log(error)
      alert("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const statusHandler = async (e, orderId) => {
    try {
      const result = await axios.post(serverUrl + "/api/order/status", {
        orderId, 
        status: e.target. value
      }, {
        withCredentials: true
      })
      if(result.data){
        await fetchAllOrders()
      } 
    } catch (error) {
      console.log(error)
      alert("Failed to update status")
    }
  }

  // Filter orders by status
  useEffect(() => {
    if(filterStatus === 'All') {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter(order => order. status === filterStatus))
    }
  }, [filterStatus, orders])

  useEffect(() => {
    fetchAllOrders()
  }, [])

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered':
        return 'bg-emerald-600'
      case 'Shipped':
      case 'Out For Delivery': 
        return 'bg-blue-600'
      case 'Packing':
        return 'bg-amber-600'
      case 'Order Placed':
        return 'bg-violet-600'
      default: 
        return 'bg-slate-600'
    }
  }

  return (
    <div className='w-full min-h-screen bg-slate-950'>
      <Nav/>
      
      <div className='flex'>
        <Sidebar/>
        
        {/* Main Content */}
        <main className='flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 mt-20'>
          <div className='max-w-7xl mx-auto'>
            
            {/* Header */}
            <div className='mb-8'>
              <h1 className='text-3xl md:text-4xl font-bold text-white mb-2'>Orders Management</h1>
              <p className='text-slate-400'>View and manage all customer orders</p>
            </div>

            {/* Filter Bar */}
            <div className='bg-slate-900 border border-slate-800 rounded-lg p-4 mb-6'>
              <div className='flex flex-wrap items-center justify-between gap-4'>
                <div className='flex flex-wrap gap-2'>
                  {['All', 'Order Placed', 'Packing', 'Shipped', 'Out For Delivery', 'Delivered'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        filterStatus === status
                          ? 'bg-violet-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                <button
                  onClick={fetchAllOrders}
                  className='px-4 py-2 bg-slate-800 hover:bg-violet-600 text-white font-semibold rounded-lg transition-colors'
                >
                  Refresh
                </button>
              </div>
              <p className='text-slate-400 text-sm mt-4'>
                Showing {filteredOrders.length} of {orders.length} orders
              </p>
            </div>

            {loading ? (
              // Loading State
              <div className='flex items-center justify-center py-20'>
                <div className='w-12 h-12 border-4 border-violet-600/30 border-t-violet-600 rounded-full animate-spin'></div>
              </div>
            ) : filteredOrders.length > 0 ? (
              // Orders List
              <div className='space-y-4'>
                {filteredOrders.map((order, index) => (
                  <div 
                    key={index} 
                    className='bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-violet-600 transition-colors'
                  >
                    <div className='grid lg:grid-cols-4 gap-6'>
                      
                      {/* Order Items */}
                      <div className='lg:col-span-1'>
                        <div className='flex items-center gap-2 mb-3'>
                          <FiPackage className='w-5 h-5 text-violet-400' />
                          <h3 className='text-white font-semibold'>Order Items</h3>
                        </div>
                        <div className='space-y-2'>
                          {order.items.map((item, idx) => (
                            <div key={idx} className='text-sm'>
                              <p className='text-slate-300 font-medium'>{item.name}</p>
                              <p className='text-slate-500'>
                                Qty: {item.quantity} • Size: {item.size}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Customer Details */}
                      <div className='lg:col-span-1'>
                        <div className='flex items-center gap-2 mb-3'>
                          <FiUser className='w-5 h-5 text-emerald-400' />
                          <h3 className='text-white font-semibold'>Customer</h3>
                        </div>
                        <div className='space-y-1 text-sm'>
                          <p className='text-slate-300 font-medium'>
                            {order.address. firstName} {order.address.lastName}
                          </p>
                          <div className='flex items-start gap-2 text-slate-400'>
                            <FiMapPin className='w-4 h-4 mt-0.5 flex-shrink-0' />
                            <div>
                              <p>{order.address.street}</p>
                              <p>{order.address.city}, {order.address.state}</p>
                              <p>{order.address.pincode}</p>
                            </div>
                          </div>
                          <p className='text-slate-400'>📞 {order.address.phone}</p>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className='lg:col-span-1'>
                        <div className='flex items-center gap-2 mb-3'>
                          <FiCreditCard className='w-5 h-5 text-amber-400' />
                          <h3 className='text-white font-semibold'>Details</h3>
                        </div>
                        <div className='space-y-2 text-sm'>
                          <div className='flex justify-between'>
                            <span className='text-slate-400'>Items:</span>
                            <span className='text-white font-semibold'>{order.items. length}</span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-slate-400'>Payment:</span>
                            <span className='text-white capitalize'>{order.paymentMethod}</span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-slate-400'>Status:</span>
                            <span className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                              order.payment ? 'bg-emerald-600' : 'bg-amber-600'
                            }`}>
                              {order.payment ? 'Paid' : 'Pending'}
                            </span>
                          </div>
                          <div className='flex items-center gap-2 text-slate-400'>
                            <FiCalendar className='w-4 h-4' />
                            <span>{new Date(order.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}</span>
                          </div>
                          <div className='pt-2 border-t border-slate-800'>
                            <p className='text-violet-400 font-bold text-xl'>₹{order.amount}</p>
                          </div>
                        </div>
                      </div>

                      {/* Status Update */}
                      <div className='lg:col-span-1'>
                        <h3 className='text-white font-semibold mb-3'>Update Status</h3>
                        <select
                          value={order.status}
                          onChange={(e) => statusHandler(e, order._id)}
                          className={`w-full h-12 rounded-lg px-4 text-white font-semibold border-2 transition-all cursor-pointer focus:outline-none ${getStatusColor(order.status)}`}
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Packing">Packing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out For Delivery">Out For Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                        
                        {/* Status Indicator */}
                        <div className='mt-4 flex items-center gap-2'>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(order.status)}`}></div>
                          <span className='text-slate-400 text-sm'>{order.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Empty State
              <div className='flex flex-col items-center justify-center py-20'>
                <div className='w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6'>
                  <span className='text-5xl'>📦</span>
                </div>
                <h3 className='text-white text-2xl font-bold mb-2'>No orders found</h3>
                <p className='text-slate-400 text-center'>
                  {filterStatus === 'All' 
                    ? 'No orders have been placed yet' 
                    : `No orders with status "${filterStatus}"`
                  }
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Orders