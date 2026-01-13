import React, { useContext, useEffect, useState } from 'react'
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import { shopDataContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

function Collections() {
  const [showFilter, setShowFilter] = useState(false);
  let {products, search, showSearch} = useContext(shopDataContext);
  let [filterProduct, setFilterProduct] = useState([]);
  let [category, setCategory] = useState([]);
  let [subCategory, setSubCategory] = useState([]);
  let [sortType, setSortType] = useState("Relevant");
  const navigate = useNavigate();

  const toggleCategory = (e) => {
    if(category.includes(e.target.value)){
      setCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const toggleSubCategory = (e) => {
    if(subCategory.includes(e.target. value)){
      setSubCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setSubCategory(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = () => {
    let productCopy = products.slice()

    if(showSearch && search) {
      productCopy = productCopy.filter(item => 
        item.name. toLowerCase().includes(search.toLowerCase())
      )
    }

    if(category.length > 0) {
      productCopy = productCopy.filter(item => category.includes(item.category))
    }

    if(subCategory.length > 0) {
      productCopy = productCopy.filter(item => subCategory.includes(item.subCategory))
    }

    setFilterProduct(productCopy);
  }

  const sortProducts = () => {
    let fbCopy = filterProduct.slice();
    
    switch(sortType) {
      case "Low-High":
        setFilterProduct(fbCopy. sort((a, b) => (a.price - b.price)));
        break;
      case "High-Low":
        setFilterProduct(fbCopy.sort((a, b) => (b.price - a.price)));
        break;
      default:
        applyFilter();
        break;
    }
  } 

  useEffect(() => {
    setFilterProduct(products);
  }, [products])

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products])

  useEffect(() => {
    sortProducts();
  }, [sortType])

  return (
    <div className='w-full min-h-screen bg-slate-950 pt-24 pb-20 md:pb-8'>
      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8'>
        
        <div className='flex gap-8'>
          
          {/* Sidebar - Filters */}
          <aside className='hidden lg:block w-64 flex-shrink-0'>
            <div className='sticky top-24 space-y-6'>
              
              {/* Header */}
              <div className='flex items-center justify-between'>
                <h3 className='text-white text-lg font-bold'>Filters</h3>
                {(category.length > 0 || subCategory.length > 0) && (
                  <button
                    onClick={() => {
                      setCategory([]);
                      setSubCategory([]);
                    }}
                    className='text-violet-400 text-sm hover:text-violet-300'
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className='bg-slate-900 border border-slate-800 rounded-lg p-4'>
                <h4 className='text-white font-semibold mb-3 text-sm'>CATEGORIES</h4>
                <div className='space-y-2'>
                  {['Men', 'Women', 'Kids']. map((cat) => (
                    <label key={cat} className='flex items-center gap-2 cursor-pointer group'>
                      <input
                        type='checkbox'
                        value={cat}
                        className='w-4 h-4 rounded border-slate-600 text-violet-600 focus:ring-violet-600'
                        onChange={toggleCategory}
                        checked={category.includes(cat)}
                      />
                      <span className='text-slate-400 text-sm group-hover:text-white transition-colors'>
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Types */}
              <div className='bg-slate-900 border border-slate-800 rounded-lg p-4'>
                <h4 className='text-white font-semibold mb-3 text-sm'>TYPE</h4>
                <div className='space-y-2'>
                  {[
                    { value: 'TopWear', label: 'Topwear' },
                    { value: 'BottomWear', label: 'Bottomwear' },
                    { value: 'WinterWear', label: 'Winterwear' }
                  ].map((type) => (
                    <label key={type.value} className='flex items-center gap-2 cursor-pointer group'>
                      <input
                        type='checkbox'
                        value={type. value}
                        className='w-4 h-4 rounded border-slate-600 text-violet-600 focus:ring-violet-600'
                        onChange={toggleSubCategory}
                        checked={subCategory.includes(type.value)}
                      />
                      <span className='text-slate-400 text-sm group-hover:text-white transition-colors'>
                        {type. label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Active Filters */}
              {(category.length > 0 || subCategory.length > 0) && (
                <div className='bg-violet-600/10 border border-violet-600/30 rounded-lg p-4'>
                  <p className='text-violet-400 text-xs font-semibold mb-2'>Active Filters: </p>
                  <div className='flex flex-wrap gap-2'>
                    {[... category, ...subCategory].map((filter, idx) => (
                      <span key={idx} className='px-2 py-1 bg-violet-600/20 text-violet-300 text-xs rounded border border-violet-600/30'>
                        {filter}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className='lg:hidden fixed bottom-20 right-4 z-40 w-14 h-14 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full shadow-xl flex items-center justify-center text-white'
          >
            {showFilter ? <FaChevronDown /> : <FaChevronRight />}
          </button>

          {/* Mobile Filter Sidebar */}
          {showFilter && (
            <>
              <div 
                className='lg:hidden fixed inset-0 bg-black/60 z-30'
                onClick={() => setShowFilter(false)}
              />
              <div className='lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-slate-900 z-40 overflow-y-auto p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h3 className='text-white text-lg font-bold'>Filters</h3>
                  <button onClick={() => setShowFilter(false)} className='text-slate-400'>✕</button>
                </div>

                {/* Categories */}
                <div className='bg-slate-800 border border-slate-700 rounded-lg p-4 mb-4'>
                  <h4 className='text-white font-semibold mb-3 text-sm'>CATEGORIES</h4>
                  <div className='space-y-2'>
                    {['Men', 'Women', 'Kids'].map((cat) => (
                      <label key={cat} className='flex items-center gap-2 cursor-pointer'>
                        <input
                          type='checkbox'
                          value={cat}
                          className='w-4 h-4'
                          onChange={toggleCategory}
                          checked={category.includes(cat)}
                        />
                        <span className='text-slate-400 text-sm'>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Types */}
                <div className='bg-slate-800 border border-slate-700 rounded-lg p-4'>
                  <h4 className='text-white font-semibold mb-3 text-sm'>TYPE</h4>
                  <div className='space-y-2'>
                    {[
                      { value: 'TopWear', label: 'Topwear' },
                      { value: 'BottomWear', label: 'Bottomwear' },
                      { value: 'WinterWear', label: 'Winterwear' }
                    ].map((type) => (
                      <label key={type.value} className='flex items-center gap-2 cursor-pointer'>
                        <input
                          type='checkbox'
                          value={type.value}
                          className='w-4 h-4'
                          onChange={toggleSubCategory}
                          checked={subCategory.includes(type. value)}
                        />
                        <span className='text-slate-400 text-sm'>{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Main Content */}
          <main className='flex-1 min-w-0'>
            
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>
              <div>
                <h1 className='text-white text-3xl font-bold mb-2'>All Collections</h1>
                <p className='text-slate-400 text-sm'>{filterProduct.length} products found</p>
              </div>

              {/* Sort */}
              <select
                value={sortType}
                className='w-full sm:w-48 h-12 px-4 bg-slate-900 border border-slate-800 rounded-lg text-white text-sm focus: outline-none focus:border-violet-600 cursor-pointer transition-colors'
                onChange={(e) => setSortType(e.target.value)}
              >
                <option value="Relevant">Sort by: Relevant</option>
                <option value="Low-High">Price: Low to High</option>
                <option value="High-Low">Price: High to Low</option>
              </select>
            </div>

            {/* Products Grid */}
            {filterProduct.length > 0 ? (
              <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'>
                {filterProduct.map((item, index) => (
                  <div
                    key={item._id || index}
                    onClick={() => navigate(`/productdetail/${item._id}`)}
                    className='group bg-slate-900 border border-slate-800 rounded-lg overflow-hidden cursor-pointer hover:border-violet-600 transition-all'
                  >
                    {/* Image */}
                    <div className='relative w-full aspect-square bg-slate-800 overflow-hidden'>
                      <img
                        src={item.image1}
                        alt={item. name}
                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                      />
                      {/* Overlay */}
                      <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'>
                        <div className='absolute bottom-4 left-0 right-0 text-center'>
                          <span className='px-4 py-2 bg-white/90 text-slate-900 text-sm font-semibold rounded-full'>
                            View Details
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className='p-4'>
                      <h3 className='text-white text-sm md:text-base font-medium mb-2 truncate group-hover:text-violet-400 transition-colors'>
                        {item.name}
                      </h3>
                      <p className='text-violet-400 text-lg font-bold'>
                        ₹{item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center py-20'>
                <div className='w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4'>
                  <span className='text-4xl'>🛍️</span>
                </div>
                <h3 className='text-white text-xl font-bold mb-2'>No products found</h3>
                <p className='text-slate-400 text-center mb-6'>Try adjusting your filters</p>
                <button
                  onClick={() => {
                    setCategory([]);
                    setSubCategory([]);
                  }}
                  className='px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg transition-colors'
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Collections