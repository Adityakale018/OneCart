import React, { useContext, useEffect, useState } from 'react'
import { FaChevronDown } from "react-icons/fa";
import { FiSliders, FiX, FiSearch } from "react-icons/fi";
import { shopDataContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

function Collections() {
  const [showFilter, setShowFilter] = useState(false)
  const { products, search, setSearch } = useContext(shopDataContext)
  const [filterProduct, setFilterProduct] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState('Relevant')
  const navigate = useNavigate()

  const toggleCategory = (e) => {
    const v = e.target.value
    setCategory(prev => prev.includes(v) ? prev.filter(i => i !== v) : [...prev, v])
  }
  const toggleSubCategory = (e) => {
    const v = e.target.value
    setSubCategory(prev => prev.includes(v) ? prev.filter(i => i !== v) : [...prev, v])
  }
  const applyFilter = () => {
    let copy = products.slice()
    if (search) copy = copy.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
    if (category.length > 0) copy = copy.filter(i => category.includes(i.category))
    if (subCategory.length > 0) copy = copy.filter(i => subCategory.includes(i.subCategory))
    setFilterProduct(copy)
  }
  const sortProducts = () => {
    let copy = filterProduct.slice()
    if (sortType === 'Low-High') setFilterProduct(copy.sort((a, b) => a.price - b.price))
    else if (sortType === 'High-Low') setFilterProduct(copy.sort((a, b) => b.price - a.price))
    else applyFilter()
  }

  useEffect(() => { setFilterProduct(products) }, [products])
  useEffect(() => { applyFilter() }, [category, subCategory, search, products])
  useEffect(() => { sortProducts() }, [sortType])

  const clearAll = () => { setCategory([]); setSubCategory([]) }
  const activeCount = category.length + subCategory.length

  /* Filter panel (reusable for sidebar + mobile drawer) */
  const FilterPanel = ({ bg = 'bg-white' }) => (
    <div className="space-y-5">
      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Categories</h4>
        <div className="space-y-2">
          {['Men', 'Women', 'Kids'].map(cat => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox" value={cat}
                onChange={toggleCategory} checked={category.includes(cat)}
                className="w-4 h-4 rounded border-gray-300 accent-[#ff3f6c] cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{cat}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="h-px bg-gray-100" />
      {/* Types */}
      <div>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Type</h4>
        <div className="space-y-2">
          {[
            { value: 'TopWear', label: 'Topwear' },
            { value: 'BottomWear', label: 'Bottomwear' },
            { value: 'WinterWear', label: 'Winterwear' },
          ].map(t => (
            <label key={t.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox" value={t.value}
                onChange={toggleSubCategory} checked={subCategory.includes(t.value)}
                className="w-4 h-4 rounded border-gray-300 accent-[#ff3f6c] cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{t.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile filter drawer */}
      {showFilter && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setShowFilter(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 overflow-y-auto p-6 lg:hidden shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900">Filters</h3>
              <button onClick={() => setShowFilter(false)}><FiX className="w-5 h-5 text-gray-500" /></button>
            </div>
            <FilterPanel />
            {activeCount > 0 && (
              <button onClick={clearAll} className="mt-6 w-full border border-[#ff3f6c] text-[#ff3f6c] font-semibold py-2.5 rounded-lg hover:bg-rose-50 transition-colors text-sm">
                Clear All ({activeCount})
              </button>
            )}
          </div>
        </>
      )}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Mobile Search Bar */}
        <div className="md:hidden w-full mb-5">
          <div className="relative w-full">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, brands and more..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 bg-white border border-gray-200 rounded-xl pl-11 pr-10 text-sm text-gray-855 placeholder-gray-400 focus:outline-none focus:border-[#ff3f6c] focus:ring-1 focus:ring-[#ff3f6c] shadow-sm transition-all"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Collections</h1>
            <p className="text-sm text-gray-500 mt-0.5">{filterProduct.length} products</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile filter btn */}
            <button
              onClick={() => setShowFilter(true)}
              className="lg:hidden flex items-center gap-2 text-sm font-semibold border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 hover:border-gray-400 transition-colors"
            >
              <FiSliders className="w-4 h-4" />
              Filters {activeCount > 0 && <span className="bg-[#ff3f6c] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{activeCount}</span>}
            </button>
            {/* Sort */}
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#ff3f6c] cursor-pointer"
            >
              <option value="Relevant">Relevance</option>
              <option value="Low-High">Price: Low to High</option>
              <option value="High-Low">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex gap-7">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <FiSliders className="w-4 h-4" />
                  Filters
                </h3>
                {activeCount > 0 && (
                  <button onClick={clearAll} className="text-xs font-semibold text-[#ff3f6c] hover:underline">
                    Clear ({activeCount})
                  </button>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Product grid */}
          <main className="flex-1 min-w-0">
            {/* Active filter chips */}
            {activeCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {[...category, ...subCategory].map((f, i) => (
                  <span key={i} className="flex items-center gap-1 text-xs font-semibold bg-rose-50 text-[#ff3f6c] border border-rose-200 px-3 py-1 rounded-full">
                    {f}
                    <button
                      onClick={() => {
                        if (category.includes(f)) setCategory(prev => prev.filter(x => x !== f))
                        else setSubCategory(prev => prev.filter(x => x !== f))
                      }}
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {filterProduct.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {filterProduct.map((item, index) => (
                  <div
                    key={item._id || index}
                    onClick={() => navigate(`/productdetail/${item._id}`)}
                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {/* Image */}
                    <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100">
                      <img
                        src={item.image1}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                        <span className="bg-white text-gray-900 text-xs font-bold px-4 py-2 rounded-full shadow">
                          View Details
                        </span>
                      </div>
                      {item.bestseller && (
                        <span className="absolute top-2 left-2 bg-[#ff3f6c] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          BESTSELLER
                        </span>
                      )}
                    </div>
                    {/* Info */}
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#ff3f6c] transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[#ff3f6c] font-bold text-sm">₹{item.price}</p>
                        <p className="text-gray-400 text-xs line-through">₹{Math.round(item.price * 1.3)}</p>
                      </div>
                      <p className="text-emerald-600 text-xs font-semibold mt-0.5">30% off</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <FiSearch className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="font-bold text-gray-700 text-lg mb-2">No products found</h3>
                <p className="text-gray-500 text-sm mb-6">Try adjusting your filters</p>
                <button onClick={clearAll} className="px-6 py-2.5 bg-[#ff3f6c] text-white font-bold rounded-lg hover:bg-[#e8365d] transition-colors text-sm">
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Collections