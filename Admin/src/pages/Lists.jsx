import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav'
import Sidebar from '../components/Sidebar'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { FiTrash2, FiEdit, FiSearch } from 'react-icons/fi'

function Lists() {
  let [list, setList] = useState([])
  let [filteredList, setFilteredList] = useState([])
  let [searchQuery, setSearchQuery] = useState('')
  let [loading, setLoading] = useState(true)
  let {serverUrl} = useContext(authDataContext)

  const fetchList = async () => {
    setLoading(true)
    try {
      let result = await axios.get(serverUrl + "/api/product/list")
      setList(result.data)
      setFilteredList(result.data)
      console.log(result.data)
    } catch (error) {
      console.log(error)
      alert("Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  const removeList = async (id, name) => {
    if(! window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    try {
      let result = await axios.post(`${serverUrl}/api/product/remove/${id}`, {}, {withCredentials: true})

      if(result.data){
        alert("Product deleted successfully")
        fetchList()
      } else {
        alert("Failed to remove product")
      }
    } catch (error) {
      console.log(error)
      alert("Error deleting product")
    }
  }

  // Search functionality
  useEffect(() => {
    if(searchQuery === '') {
      setFilteredList(list)
    } else {
      const filtered = list.filter(item =>
        item.name. toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category. toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredList(filtered)
    }
  }, [searchQuery, list])

  useEffect(() => {
    fetchList()
  }, [])

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
              <h1 className='text-3xl md:text-4xl font-bold text-white mb-2'>Product List</h1>
              <p className='text-slate-400'>Manage all products in your store</p>
            </div>

            {/* Search Bar */}
            <div className='bg-slate-900 border border-slate-800 rounded-lg p-4 mb-6'>
              <div className='relative'>
                <FiSearch className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500' />
                <input
                  type='text'
                  placeholder='Search products by name or category...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full h-12 bg-slate-950 border border-slate-800 rounded-lg pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus: border-violet-600 transition-colors'
                />
              </div>
              <div className='flex items-center justify-between mt-4'>
                <p className='text-slate-400 text-sm'>
                  Showing {filteredList.length} of {list.length} products
                </p>
                <button 
                  onClick={fetchList}
                  className='px-4 py-2 bg-slate-800 hover:bg-violet-600 text-white text-sm font-semibold rounded-lg transition-colors'
                >
                  Refresh
                </button>
              </div>
            </div>

            {loading ? (
              // Loading State
              <div className='flex items-center justify-center py-20'>
                <div className='w-12 h-12 border-4 border-violet-600/30 border-t-violet-600 rounded-full animate-spin'></div>
              </div>
            ) : filteredList?. length > 0 ? (
              // Product List
              <div className='space-y-4'>
                {filteredList.map((item, index) => (
                  <div 
                    key={index} 
                    className='bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-violet-600 transition-colors'
                  >
                    <div className='flex items-center gap-4'>
                      
                      {/* Product Image */}
                      <div className='w-20 h-20 md:w-28 md:h-28 flex-shrink-0 bg-slate-800 rounded-lg overflow-hidden'>
                        <img 
                          src={item. image1} 
                          alt={item.name}
                          className='w-full h-full object-cover'
                        />
                      </div>

                      {/* Product Info */}
                      <div className='flex-1 min-w-0'>
                        <h3 className='text-white font-semibold text-lg mb-2 truncate'>
                          {item.name}
                        </h3>
                        
                        <div className='flex flex-wrap items-center gap-3 mb-2'>
                          <span className='px-3 py-1 bg-violet-600/20 text-violet-400 text-xs font-semibold rounded-full'>
                            {item.category}
                          </span>
                          <span className='px-3 py-1 bg-slate-800 text-slate-300 text-xs font-semibold rounded-full'>
                            {item.subCategory}
                          </span>
                          {item.bestseller && (
                            <span className='px-3 py-1 bg-amber-600/20 text-amber-400 text-xs font-semibold rounded-full flex items-center gap-1'>
                              ⭐ Bestseller
                            </span>
                          )}
                        </div>

                        <div className='flex items-center gap-4 text-sm'>
                          <p className='text-violet-400 font-bold text-xl'>
                            ₹{item.price}
                          </p>
                          <p className='text-slate-400'>
                            Sizes: {item.sizes?. join(', ')}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className='flex flex-col gap-2'>
                        {/* Edit Button (Optional) */}
                        <button
                          className='w-10 h-10 bg-slate-800 hover:bg-violet-600 text-slate-400 hover:text-white rounded-lg flex items-center justify-center transition-colors'
                          title='Edit Product'
                        >
                          <FiEdit className='w-4 h-4' />
                        </button>
                        
                        {/* Delete Button */}
                        <button
                          onClick={() => removeList(item._id, item.name)}
                          className='w-10 h-10 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg flex items-center justify-center transition-colors'
                          title='Delete Product'
                        >
                          <FiTrash2 className='w-4 h-4' />
                        </button>
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
                <h3 className='text-white text-2xl font-bold mb-2'>
                  {searchQuery ? 'No products found' : 'No products available'}
                </h3>
                <p className='text-slate-400 text-center mb-8'>
                  {searchQuery 
                    ? 'Try adjusting your search query' 
                    : 'Start by adding your first product'
                  }
                </p>
                {! searchQuery && (
                  <button
                    onClick={() => window.location.href = '/add'}
                    className='px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all'
                  >
                    Add Product
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Lists