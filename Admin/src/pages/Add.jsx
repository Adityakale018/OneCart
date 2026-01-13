import React, { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Nav from '../components/Nav'
import upload from '../assets/Upload.png'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { FiUpload, FiCheck } from 'react-icons/fi'

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
  let {serverUrl} = useContext(authDataContext)

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

      let result = await axios.post(serverUrl + "/api/product/addproduct", formData, {withCredentials: true})
      console.log(result.data)

      if(result.data){
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
      }
    } catch (error) {
      console.log(error)
      alert("Failed to add product.  Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full min-h-screen bg-slate-950 text-white'>
      <Nav/>
      <div className='flex'>
        <Sidebar/>
        
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
                    { img: image1, setImg: setImage1, id: 'image1' },
                    { img: image2, setImg: setImage2, id: 'image2' },
                    { img: image3, setImg: setImage3, id: 'image3' },
                    { img: image4, setImg: setImage4, id: 'image4' }
                  ].map((item, idx) => (
                    <label
                      key={idx}
                      htmlFor={item.id}
                      className='relative aspect-square bg-slate-800 border-2 border-dashed border-slate-700 hover:border-violet-600 rounded-lg cursor-pointer transition-colors overflow-hidden group'
                    >
                      {! item.img ? (
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
                        onChange={(e) => item.setImg(e.target. files[0])}
                        required
                      />
                    </label>
                  ))}
                </div>
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
                    className='w-full h-12 bg-slate-950 border border-slate-800 rounded-lg px-4 text-white placeholder-slate-500 focus:outline-none focus: border-violet-600 transition-colors'
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
                    onChange={(e) => setDescription(e. target.value)}
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
                    className='w-full h-12 bg-slate-950 border border-slate-800 rounded-lg px-4 text-white placeholder-slate-500 focus:outline-none focus: border-violet-600 transition-colors'
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
                {loading ?  (
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