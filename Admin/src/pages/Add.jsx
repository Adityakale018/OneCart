import React, { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Nav from '../components/Nav'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { FiUpload, FiCheck, FiZap, FiLoader, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi'

function Add() {
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Men")
  const [price, setPrice] = useState("")
  const [subCategory, setSubCategory] = useState("TopWear")
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])
  const [loading, setLoading] = useState(false)

  // AI Auto-Fill state
  const [aiLoading, setAiLoading] = useState(false)
  const [aiStatus, setAiStatus] = useState(null) // null | 'success' | 'error'
  const [aiMessage, setAiMessage] = useState("")

  let { serverUrl } = useContext(authDataContext)

  // ── AI Auto-Fill Handler ─────────────────────────────────────────────────────
  const handleAiGenerate = async () => {
    if (!image1) {
      setAiStatus('error')
      setAiMessage('Please upload Image 1 first so AI can analyze the product.')
      return
    }

    setAiLoading(true)
    setAiStatus(null)
    setAiMessage("")

    try {
      const formData = new FormData()
      formData.append("image", image1)

      const result = await axios.post(
        serverUrl + "/api/ai/generate-product-details",
        formData,
        { withCredentials: true }
      )

      if (result.data.success && result.data.product) {
        const p = result.data.product
        setName(p.name || "")
        setDescription(p.description || "")
        setCategory(p.category || "Men")
        setSubCategory(p.subCategory || "TopWear")
        setPrice(String(p.price || ""))
        setSizes(p.sizes || [])
        setBestseller(p.bestseller || false)

        setAiStatus('success')
        setAiMessage("✨ AI has auto-filled all product details! Review and edit before submitting.")
      } else {
        throw new Error("Invalid response from AI")
      }
    } catch (error) {
      console.error(error)
      const msg = error?.response?.data?.message || error.message || "AI generation failed."
      setAiStatus('error')
      setAiMessage(msg)
    } finally {
      setAiLoading(false)
    }
  }

  // ── Product Submit Handler ────────────────────────────────────────────────────
  const handleAddProduct = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      formData.append("price", price)
      formData.append("sizes", JSON.stringify(sizes))
      formData.append("image1", image1)
      formData.append("image2", image2)
      formData.append("image3", image3)
      formData.append("image4", image4)

      let result = await axios.post(serverUrl + "/api/product/addproduct", formData, { withCredentials: true })
      console.log(result.data)

      if (result.data) {
        alert("Product added successfully!")
        // Reset form
        setName("")
        setDescription("")
        setPrice("")
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setBestseller(false)
        setSizes([])
        setCategory("Men")
        setSubCategory("TopWear")
        setAiStatus(null)
        setAiMessage("")
      }
    } catch (error) {
      console.log(error)
      alert("Failed to add product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full min-h-screen bg-slate-950 text-white'>
      <Nav />
      <div className='flex'>
        <Sidebar />

        {/* Main Content */}
        <div className='flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 mt-20'>
          <div className='max-w-4xl mx-auto'>

            {/* Header */}
            <div className='mb-8'>
              <h1 className='text-3xl md:text-4xl font-bold text-white mb-2'>Add New Product</h1>
              <p className='text-slate-400'>Fill in the details to add a product to your store</p>
            </div>

            <form onSubmit={handleAddProduct} className='space-y-8'>

              {/* Upload Images */}
              <div className='bg-slate-900 border border-slate-800 rounded-lg p-6'>
                <h3 className='text-xl font-semibold mb-4'>Product Images</h3>
                <p className='text-slate-400 text-sm mb-4'>Upload 4 images (required)</p>

                <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                  {[
                    { img: image1, setImg: setImage1, id: 'image1', label: '1' },
                    { img: image2, setImg: setImage2, id: 'image2', label: '2' },
                    { img: image3, setImg: setImage3, id: 'image3', label: '3' },
                    { img: image4, setImg: setImage4, id: 'image4', label: '4' },
                  ].map((item, idx) => (
                    <label
                      key={idx}
                      htmlFor={item.id}
                      className='relative aspect-square bg-slate-800 border-2 border-dashed border-slate-700 hover:border-violet-600 rounded-lg cursor-pointer transition-colors overflow-hidden group'
                    >
                      {/* AI badge on image1 */}
                      {idx === 0 && (
                        <span className='absolute top-1 left-1 z-10 bg-violet-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded'>
                          AI
                        </span>
                      )}
                      {!item.img ? (
                        <div className='absolute inset-0 flex flex-col items-center justify-center'>
                          <FiUpload className='w-8 h-8 text-slate-500 group-hover:text-violet-400 mb-2' />
                          <span className='text-slate-500 text-xs'>Upload</span>
                        </div>
                      ) : (
                        <img
                          src={URL.createObjectURL(item.img)}
                          alt={`Product ${idx + 1}`}
                          className='w-full h-full object-cover'
                        />
                      )}
                      <input
                        type="file"
                        id={item.id}
                        hidden
                        accept="image/*"
                        onChange={(e) => item.setImg(e.target.files[0])}
                        required
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* ✨ AI Auto-Fill Section */}
              <div className='relative bg-gradient-to-br from-violet-950/60 via-purple-950/40 to-slate-900 border border-violet-700/50 rounded-xl p-6 overflow-hidden'>
                {/* Decorative glow */}
                <div className='absolute -top-10 -right-10 w-40 h-40 bg-violet-600/20 rounded-full blur-3xl pointer-events-none' />
                <div className='absolute -bottom-6 -left-6 w-24 h-24 bg-purple-600/20 rounded-full blur-2xl pointer-events-none' />

                <div className='relative flex flex-col sm:flex-row sm:items-center gap-4'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <HiSparkles className='w-5 h-5 text-violet-400' />
                      <h3 className='text-lg font-bold text-white'>AI Product Auto-Fill</h3>
                      <span className='text-[10px] font-bold bg-violet-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider'>
                        Powered by Gemini
                      </span>
                    </div>
                    <p className='text-slate-400 text-sm'>
                      Upload <span className='text-violet-300 font-semibold'>Image 1</span> above, then click Generate — AI will instantly fill in the product name, description, category, price, sizes, and more!
                    </p>
                  </div>

                  <button
                    type='button'
                    onClick={handleAiGenerate}
                    disabled={aiLoading || !image1}
                    className={`
                      relative flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shrink-0
                      ${!image1
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 border border-violet-500/30'
                      }
                      disabled:opacity-60 disabled:scale-100
                    `}
                  >
                    {aiLoading ? (
                      <>
                        <FiLoader className='w-4 h-4 animate-spin' />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <FiZap className='w-4 h-4' />
                        <span>✨ Auto-Fill with AI</span>
                      </>
                    )}

                    {/* Shimmer animation when active */}
                    {!aiLoading && image1 && (
                      <span className='absolute inset-0 rounded-xl overflow-hidden pointer-events-none'>
                        <span className='absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent' />
                      </span>
                    )}
                  </button>
                </div>

                {/* AI Status Banner */}
                {aiStatus && (
                  <div className={`mt-4 flex items-start gap-3 px-4 py-3 rounded-lg border text-sm ${
                    aiStatus === 'success'
                      ? 'bg-emerald-950/50 border-emerald-700/50 text-emerald-300'
                      : 'bg-red-950/50 border-red-700/50 text-red-300'
                  }`}>
                    {aiStatus === 'success'
                      ? <FiCheckCircle className='w-4 h-4 mt-0.5 shrink-0' />
                      : <FiAlertCircle className='w-4 h-4 mt-0.5 shrink-0' />
                    }
                    <span>{aiMessage}</span>
                  </div>
                )}

                {/* Loading skeleton overlay */}
                {aiLoading && (
                  <div className='mt-4 space-y-2 animate-pulse'>
                    <div className='h-3 bg-slate-700 rounded w-3/4' />
                    <div className='h-3 bg-slate-700 rounded w-1/2' />
                    <div className='h-3 bg-slate-700 rounded w-2/3' />
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className='bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6'>
                <h3 className='text-xl font-semibold'>Product Details</h3>

                {/* Product Name */}
                <div>
                  <label className='text-slate-400 text-sm mb-2 block'>Product Name</label>
                  <input
                    type="text"
                    placeholder='Enter product name'
                    className='w-full h-12 bg-slate-950 border border-slate-800 rounded-lg px-4 text-white placeholder-slate-500 focus:outline-none focus:border-violet-600 transition-colors'
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className='text-slate-400 text-sm mb-2 block'>Product Description</label>
                  <textarea
                    placeholder='Enter product description'
                    rows='4'
                    className='w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-600 transition-colors resize-none'
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    required
                  />
                </div>

                {/* Category & Subcategory */}
                <div className='grid sm:grid-cols-2 gap-6'>
                  <div>
                    <label className='text-slate-400 text-sm mb-2 block'>Category</label>
                    <select
                      className='w-full h-12 bg-slate-950 border border-slate-800 rounded-lg px-4 text-white focus:outline-none focus:border-violet-600 transition-colors cursor-pointer'
                      onChange={(e) => setCategory(e.target.value)}
                      value={category}
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>

                  <div>
                    <label className='text-slate-400 text-sm mb-2 block'>Subcategory</label>
                    <select
                      className='w-full h-12 bg-slate-950 border border-slate-800 rounded-lg px-4 text-white focus:outline-none focus:border-violet-600 transition-colors cursor-pointer'
                      onChange={(e) => setSubCategory(e.target.value)}
                      value={subCategory}
                    >
                      <option value="TopWear">Topwear</option>
                      <option value="BottomWear">Bottomwear</option>
                      <option value="WinterWear">Winterwear</option>
                    </select>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className='text-slate-400 text-sm mb-2 block'>Price</label>
                  <input
                    type="number"
                    placeholder='₹ 0'
                    className='w-full h-12 bg-slate-950 border border-slate-800 rounded-lg px-4 text-white placeholder-slate-500 focus:outline-none focus:border-violet-600 transition-colors'
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                    required
                  />
                </div>
              </div>

              {/* Product Sizes */}
              <div className='bg-slate-900 border border-slate-800 rounded-lg p-6'>
                <h3 className='text-xl font-semibold mb-4'>Available Sizes</h3>
                <p className='text-slate-400 text-sm mb-4'>Select all applicable sizes</p>

                <div className='flex flex-wrap gap-3'>
                  {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      type='button'
                      onClick={() => setSizes(prev =>
                        prev.includes(size)
                          ? prev.filter(item => item !== size)
                          : [...prev, size]
                      )}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                        sizes.includes(size)
                          ? 'bg-violet-600 text-white border-2 border-violet-600'
                          : 'bg-slate-800 text-slate-300 border-2 border-slate-700 hover:border-violet-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bestseller Toggle */}
              <div className='bg-slate-900 border border-slate-800 rounded-lg p-6'>
                <label className='flex items-center gap-3 cursor-pointer'>
                  <input
                    type="checkbox"
                    checked={bestseller}
                    onChange={() => setBestseller(prev => !prev)}
                    className='w-5 h-5 rounded border-slate-700 text-violet-600 focus:ring-violet-600 cursor-pointer'
                  />
                  <div>
                    <span className='text-white font-semibold text-lg'>Mark as Bestseller</span>
                    <p className='text-slate-400 text-sm'>This product will appear in the bestsellers section</p>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                disabled={loading}
                className='w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-violet-500/30'
              >
                {loading ? (
                  <>
                    <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                    <span>Adding Product...</span>
                  </>
                ) : (
                  <>
                    <FiCheck className='w-5 h-5' />
                    <span>Add Product</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Add