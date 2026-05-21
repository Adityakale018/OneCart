import React, { useContext, useState, useEffect } from 'react'
import CartTotal from '../components/CartTotal'
import razorpay from "../assets/Razorpay.svg"
import { shopDataContext } from '../context/ShopContext'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FiShield, FiTruck, FiPackage, FiChevronRight } from 'react-icons/fi'

/* Input field */
const Field = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
      {label}
    </label>
    <input
      {...props}
      className="w-full h-11 border border-gray-300 rounded-lg px-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#ff3f6c] focus:ring-1 focus:ring-[#ff3f6c]/20 transition-colors"
    />
  </div>
)

function PlaceOrder() {
  const [method, setMethod] = useState('cod')
  const { serverUrl } = useContext(authDataContext)
  const navigate = useNavigate()
  const { cartItem, setCartItem, getTotalAmount, delivery_fee, products } = useContext(shopDataContext)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    street: '', city: '', state: '', pincode: '', country: '', phone: ''
  })
  const [loading, setLoading] = useState(false)

  // Load Razorpay SDK
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => { if (document.body.contains(script)) document.body.removeChild(script) }
  }, [])

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'OneCart',
      description: 'Order Payment',
      order_id: order.orderId,
      handler: async (response) => {
        try {
          const { data } = await axios.post(serverUrl + '/api/order/verifyrazorpay', response, { withCredentials: true })
          if (data.success) { setCartItem({}); navigate('/order') }
          else alert('Payment verification failed')
        } catch { alert('Payment verification failed') }
      },
      prefill: { name: `${formData.firstName} ${formData.lastName}`, email: formData.email, contact: formData.phone },
      theme: { color: '#ff3f6c' },
      modal: { ondismiss: () => setLoading(false) }
    }
    new window.Razorpay(options).open()
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const orderItems = []
      for (const id in cartItem) {
        for (const size in cartItem[id]) {
          if (cartItem[id][size] > 0) {
            const info = structuredClone(products.find((p) => p._id === id))
            if (info) { info.size = size; info.quantity = cartItem[id][size]; orderItems.push(info) }
          }
        }
      }
      const orderData = {
        address: formData, items: orderItems,
        amount: getTotalAmount() + delivery_fee,
        paymentMethod: method,
        paymentStatus: method === 'cod' ? 'COD' : 'Pending',
        payment: false
      }
      if (method === 'cod') {
        const r = await axios.post(serverUrl + '/api/order/placeorder', orderData, { withCredentials: true })
        if (r.data.success) { setCartItem({}); navigate('/order') }
        else alert('Order failed. Please try again.')
        setLoading(false)
      } else {
        const r = await axios.post(serverUrl + '/api/order/razorpay', orderData, { withCredentials: true })
        if (r.data.success) initPay(r.data)
        else { alert('Failed to create Razorpay order'); setLoading(false) }
      }
    } catch { alert('An error occurred. Please try again.'); setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-2 text-sm">
          <span className="text-gray-500 flex items-center gap-1"><FiPackage className="w-4 h-4" /> Cart</span>
          <FiChevronRight className="w-3 h-3 text-gray-400" />
          <span className="font-bold text-[#ff3f6c] flex items-center gap-1"><FiTruck className="w-4 h-4" /> Checkout</span>
          <FiChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-500">Confirmation</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
        <form onSubmit={onSubmit}>
          <div className="grid lg:grid-cols-[1fr_380px] gap-6">

            {/* ── Left: Delivery + Payment ── */}
            <div className="space-y-5">

              {/* Delivery info */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-bold text-gray-900 text-base mb-5 flex items-center gap-2">
                  <FiTruck className="w-5 h-5 text-[#ff3f6c]" />
                  Delivery Information
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="First Name" type="text" name="firstName" value={formData.firstName} onChange={onChange} required placeholder="Rahul" />
                    <Field label="Last Name"  type="text" name="lastName"  value={formData.lastName}  onChange={onChange} required placeholder="Sharma" />
                  </div>
                  <Field label="Email Address" type="email" name="email" value={formData.email} onChange={onChange} required placeholder="rahul@example.com" />
                  <Field label="Street Address" type="text" name="street" value={formData.street} onChange={onChange} required placeholder="123, MG Road" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="City"  type="text" name="city"  value={formData.city}  onChange={onChange} required placeholder="Mumbai" />
                    <Field label="State" type="text" name="state" value={formData.state} onChange={onChange} required placeholder="Maharashtra" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Pincode" type="text" name="pincode" value={formData.pincode} onChange={onChange} required placeholder="400001" />
                    <Field label="Country" type="text" name="country" value={formData.country} onChange={onChange} required placeholder="India" />
                  </div>
                  <Field label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={onChange} required placeholder="+91 98765 43210" />
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-bold text-gray-900 text-base mb-5">Payment Method</h2>
                <div className="grid grid-cols-2 gap-3">
                  {/* Razorpay */}
                  <button
                    type="button"
                    onClick={() => setMethod('razorpay')}
                    className={`h-16 border-2 rounded-xl flex items-center justify-center transition-all ${
                      method === 'razorpay'
                        ? 'border-[#ff3f6c] bg-rose-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <img src={razorpay} className="h-8 object-contain" alt="Razorpay" />
                  </button>
                  {/* COD */}
                  <button
                    type="button"
                    onClick={() => setMethod('cod')}
                    className={`h-16 border-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                      method === 'cod'
                        ? 'border-[#ff3f6c] bg-rose-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <span className="text-xl">💵</span>
                    <span className={`text-xs font-bold ${method === 'cod' ? 'text-[#ff3f6c]' : 'text-gray-600'}`}>
                      Cash on Delivery
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── Right: Order Summary ── */}
            <div className="space-y-4">
              <CartTotal />

              {/* Place order */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-13 bg-[#ff3f6c] hover:bg-[#e8365d] disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#ff3f6c]/25 py-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    PLACE ORDER
                    <FiChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Security badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <FiShield className="w-3.5 h-3.5" />
                Secure checkout · SSL encrypted · Your data is protected
              </div>

              {/* Trust items */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                {[
                  { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹499' },
                  { icon: '🔄', title: '14-Day Returns', desc: 'Easy, no questions asked' },
                  { icon: '🔒', title: 'Secure Payment', desc: '100% safe & encrypted' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex items-center gap-3">
                    <span className="text-lg">{icon}</span>
                    <div>
                      <p className="text-xs font-bold text-gray-800">{title}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PlaceOrder
