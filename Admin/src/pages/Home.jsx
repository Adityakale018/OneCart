import React, { useState, useEffect } from 'react'
import Nav from '../components/Nav'
import Sidebar from '../components/Sidebar'
import { FiPackage, FiShoppingCart, FiDollarSign, FiUsers, FiTrendingUp } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalProducts: 124,
    totalOrders: 342,
    revenue: 45670,
    customers: 89,
    pendingOrders: 12
  })

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
              <h1 className='text-3xl md:text-4xl font-bold text-white mb-2'>Dashboard</h1>
              <p className='text-slate-400'>Welcome to OneCart Admin Panel</p>
            </div>

            {/* Stats Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
              
              {/* Total Products */}
              <div className='bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-violet-600 transition-colors'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='w-12 h-12 bg-violet-600/20 rounded-lg flex items-center justify-center'>
                    <FiPackage className='w-6 h-6 text-violet-400' />
                  </div>
                  <span className='text-emerald-400 text-sm font-semibold flex items-center gap-1'>
                    <FiTrendingUp className='w-4 h-4' />
                    +12%
                  </span>
                </div>
                <h3 className='text-slate-400 text-sm mb-1'>Total Products</h3>
                <p className='text-white text-3xl font-bold'>{stats. totalProducts}</p>
              </div>

              {/* Total Orders */}
              <div className='bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-emerald-600 transition-colors'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center'>
                    <FiShoppingCart className='w-6 h-6 text-emerald-400' />
                  </div>
                  <span className='text-emerald-400 text-sm font-semibold flex items-center gap-1'>
                    <FiTrendingUp className='w-4 h-4' />
                    +8%
                  </span>
                </div>
                <h3 className='text-slate-400 text-sm mb-1'>Total Orders</h3>
                <p className='text-white text-3xl font-bold'>{stats.totalOrders}</p>
              </div>

              {/* Revenue */}
              <div className='bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-amber-600 transition-colors'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center'>
                    <FiDollarSign className='w-6 h-6 text-amber-400' />
                  </div>
                  <span className='text-emerald-400 text-sm font-semibold flex items-center gap-1'>
                    <FiTrendingUp className='w-4 h-4' />
                    +15%
                  </span>
                </div>
                <h3 className='text-slate-400 text-sm mb-1'>Total Revenue</h3>
                <p className='text-white text-3xl font-bold'>₹{stats.revenue.toLocaleString()}</p>
              </div>

              {/* Customers */}
              <div className='bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-blue-600 transition-colors'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center'>
                    <FiUsers className='w-6 h-6 text-blue-400' />
                  </div>
                  <span className='text-emerald-400 text-sm font-semibold flex items-center gap-1'>
                    <FiTrendingUp className='w-4 h-4' />
                    +5%
                  </span>
                </div>
                <h3 className='text-slate-400 text-sm mb-1'>Total Customers</h3>
                <p className='text-white text-3xl font-bold'>{stats.customers}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className='grid lg:grid-cols-3 gap-6 mb-8'>
              
              {/* Add Product */}
              <button
                onClick={() => navigate('/add')}
                className='bg-gradient-to-br from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-lg p-6 text-left transition-all shadow-lg shadow-violet-500/30 group'
              >
                <div className='w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                  <FiPackage className='w-6 h-6 text-white' />
                </div>
                <h3 className='text-white font-bold text-xl mb-2'>Add New Product</h3>
                <p className='text-violet-100 text-sm'>Add a new product to your store inventory</p>
              </button>

              {/* View Orders */}
              <button
                onClick={() => navigate('/orders')}
                className='bg-slate-900 border border-slate-800 hover:border-violet-600 rounded-lg p-6 text-left transition-all group'
              >
                <div className='w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                  <FiShoppingCart className='w-6 h-6 text-emerald-400' />
                </div>
                <h3 className='text-white font-bold text-xl mb-2'>Manage Orders</h3>
                <p className='text-slate-400 text-sm'>View and manage customer orders</p>
                {stats.pendingOrders > 0 && (
                  <span className='inline-block mt-3 px-3 py-1 bg-amber-600 text-white text-xs font-bold rounded-full'>
                    {stats.pendingOrders} Pending
                  </span>
                )}
              </button>

              {/* Product List */}
              <button
                onClick={() => navigate('/lists')}
                className='bg-slate-900 border border-slate-800 hover:border-violet-600 rounded-lg p-6 text-left transition-all group'
              >
                <div className='w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                  <FiPackage className='w-6 h-6 text-blue-400' />
                </div>
                <h3 className='text-white font-bold text-xl mb-2'>Product List</h3>
                <p className='text-slate-400 text-sm'>View and edit all products in your store</p>
              </button>
            </div>

            {/* Recent Activity */}
            <div className='bg-slate-900 border border-slate-800 rounded-lg p-6'>
              <h3 className='text-white font-bold text-xl mb-6'>Recent Activity</h3>
              <div className='space-y-4'>
                {[
                  { action: 'New order received', time: '2 minutes ago', type: 'order' },
                  { action: 'Product "Cotton Shirt" updated', time: '15 minutes ago', type: 'product' },
                  { action: 'New customer registered', time: '1 hour ago', type: 'customer' },
                  { action: 'Order #1234 completed', time: '2 hours ago', type: 'order' }
                ].map((activity, idx) => (
                  <div key={idx} className='flex items-center gap-4 p-3 bg-slate-800 rounded-lg'>
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'order' ? 'bg-emerald-400' : 
                      activity.type === 'product' ? 'bg-violet-400' :
                      'bg-blue-400'
                    }`}></div>
                    <div className='flex-1'>
                      <p className='text-white text-sm'>{activity.action}</p>
                      <p className='text-slate-500 text-xs'>{activity. time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Home
