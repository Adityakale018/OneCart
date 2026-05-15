import React, { useContext, useEffect, useState } from 'react'
import { shopDataContext } from '../context/ShopContext'
import { authDataContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FiPackage, FiShoppingBag, FiCreditCard, FiCalendar, FiRefreshCw, FiChevronRight, FiUsers } from 'react-icons/fi'

/* Status pill */
const StatusPill = ({ status }) => {
  const map = {
    delivered:   { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',  dot: 'bg-emerald-500' },
    shipped:     { cls: 'bg-blue-50 text-blue-700 border-blue-200',            dot: 'bg-blue-500'    },
    'out for delivery': { cls: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' },
    processing:  { cls: 'bg-amber-50 text-amber-700 border-amber-200',         dot: 'bg-amber-500'   },
    'order placed': { cls: 'bg-violet-50 text-violet-700 border-violet-200',   dot: 'bg-violet-500'  },
    cancelled:   { cls: 'bg-red-50 text-red-700 border-red-200',               dot: 'bg-red-500'     },
    pending:     { cls: 'bg-gray-50 text-gray-600 border-gray-200',            dot: 'bg-gray-400'    },
  }
  const key = status?.toLowerCase()
  const { cls, dot } = map[key] || map.pending
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold border px-3 py-1.5 rounded-full ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  )
}

function Order() {
  const [orderData, setOrderData] = useState([])
  const [loading, setLoading] = useState(true)
  const { serverUrl, currency } = useContext(authDataContext)
  const { products } = useContext(shopDataContext)
  const navigate = useNavigate()

  const loadOrderData = async () => {
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + '/api/order/userorder', {}, { withCredentials: true })
      if (result.data) {
        const allItems = []
        result.data.forEach((order) => {
          order.items.forEach((item) => {
            allItems.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              participantIds: order.participantIds || [],
              date: order.date,
              orderId: order._id,
            })
          })
        })
        setOrderData(allItems.reverse())
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadOrderData() }, [])

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="flex items-center justify-between py-6 border-b border-gray-200 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            {!loading && (
              <p className="text-sm text-gray-500 mt-0.5">
                {orderData.length} {orderData.length === 1 ? 'order' : 'orders'}
              </p>
            )}
          </div>
          <button
            onClick={loadOrderData}
            className="flex items-center gap-2 text-sm font-semibold text-[#ff3f6c] border border-[#ff3f6c] rounded-lg px-4 py-2 hover:bg-[#ff3f6c] hover:text-white transition-colors"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="w-10 h-10 border-4 border-[#ff3f6c]/20 border-t-[#ff3f6c] rounded-full animate-spin" />
          </div>
        )}

        {/* Empty */}
        {!loading && orderData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <FiPackage className="w-9 h-9 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-8">Start shopping to see your orders here!</p>
            <button
              onClick={() => navigate('/collection')}
              className="px-8 py-3 bg-[#ff3f6c] text-white font-bold rounded-lg hover:bg-[#e8365d] transition-colors"
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* Orders list */}
        {!loading && orderData.length > 0 && (
          <div className="space-y-4">
            {orderData.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order top bar */}
                <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-col gap-1 text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-3.5 h-3.5" />
                        Ordered: {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiCreditCard className="w-3.5 h-3.5" />
                        {item.paymentMethod?.toUpperCase()}
                      </span>
                      {item.participantIds && item.participantIds.length > 1 && (
                        <span className="flex items-center gap-1 bg-violet-100 text-violet-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                          <FiUsers className="w-3 h-3" /> Shared Order
                        </span>
                      )}
                      <span className="text-gray-400">#{item.orderId?.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <span className="font-semibold">Expected Delivery:</span> {new Date(new Date(item.date).setDate(new Date(item.date).getDate() + 7)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <StatusPill status={item.status} />
                </div>

                {/* Product row */}
                <div className="p-5 flex gap-4">
                  {/* Image */}
                  <div
                    className="w-20 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/productdetail/${item._id}`)}
                  >
                    <img
                      src={item.image1}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-bold text-gray-900 text-sm mb-1 cursor-pointer hover:text-[#ff3f6c] transition-colors truncate"
                      onClick={() => navigate(`/productdetail/${item._id}`)}
                    >
                      {item.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm mt-2">
                      <span className="font-bold text-gray-900">{currency}{item.price}</span>
                      <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded">
                        Size: {item.size}
                      </span>
                      <span className="text-gray-500 text-xs">Qty: {item.quantity}</span>
                    </div>
                    <p className="text-xs text-emerald-600 font-semibold mt-3 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      Free 14-day returns
                    </p>
                  </div>

                  {/* Track button */}
                  <div className="flex-shrink-0 flex items-center">
                    <button
                      onClick={loadOrderData}
                      className="flex items-center gap-1 text-sm font-semibold text-[#ff3f6c] border border-[#ff3f6c] px-4 py-2 rounded-lg hover:bg-[#ff3f6c] hover:text-white transition-colors whitespace-nowrap"
                    >
                      Track
                      <FiChevronRight className="w-4 h-4" />
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
