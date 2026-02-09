import React, { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import razorpay from "../assets/Razorpay.svg"
import { shopDataContext } from '../context/ShopContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function PlaceOrder() {
  let [method, setMethod] = useState('cod')
  let {serverUrl} = useContext(shopDataContext)
  let navigate = useNavigate()
  const {cartItem, setCartItem, getTotalAmount, delivery_fee, products} = useContext(shopDataContext)
  let [formData, setFormData] = useState({
    firstName:  '',
    lastName: '',
    email: '',  
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false)

  // ✅ Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    }
  }, []);

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({...formData, [name]: value});
  }

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "OneCart",
      description: "Order Payment",
      order_id: order.orderId,
      handler: async (response) => {
        console.log(response);
        try {
          const {data} = await axios.post(serverUrl + "/api/order/verifyrazorpay", response, {withCredentials: true});
          if(data.success){
            setCartItem({});
            navigate("/order");
          } else {
            alert("Payment verification failed");
          }
        } catch (error) {
          console.log(error);
          alert("Payment verification failed");
        }
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone
      },
      theme: {
        color: "#7c3aed"
      },
      modal: {
        ondismiss: function() {
          setLoading(false); // ✅ Reset loading when modal is closed
          console.log("Payment cancelled");
        }
      }
    };
    
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  const onSubmitHandler = async(e) => {
    e.preventDefault();
    setLoading(true)
    
    try {
      let orderItems = []
      for(const items in cartItem){
        for(const item in cartItem[items]){
          if(cartItem[items][item] > 0){
            const itemInfo = structuredClone(products.find((product) => product._id === items))
            if(itemInfo){
              itemInfo.size = item;
              itemInfo.quantity = cartItem[items][item];
              orderItems.push(itemInfo)
            }
          }
        }
      }
      
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getTotalAmount() + delivery_fee,
        paymentMethod: method,
        paymentStatus: method === 'cod' ? 'COD' : 'Pending',
        payment: false
      }

      switch(method){
        case 'cod':
          const result = await axios.post(serverUrl + "/api/order/placeorder", orderData, {withCredentials: true})
          console.log(result.data)
          if(result.data.success){
            setCartItem({})
            navigate("/order")
          } else {
            console.log(result.data.message)
            alert("Order failed. Please try again.")
          }
          break;

        case 'razorpay':
          const resultRazorpay = await axios.post(serverUrl + "/api/order/razorpay", orderData, {withCredentials: true})
          if(resultRazorpay.data.success){
            initPay(resultRazorpay.data)
          } else {
            alert("Failed to create Razorpay order")
          }
          break;  // ✅ Added missing break
          
        default:
          break;
      }
    } catch (error) {
      console.log(error)
      alert("An error occurred. Please try again.")
    } finally {
      // ✅ Only reset loading for COD, not for Razorpay (it resets in modal dismiss)
      if(method === 'cod') {
        setLoading(false)
      }
    }
  }

  return (
    <div className='w-full min-h-screen bg-slate-950 pt-24 pb-20 md:pb-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        
        {/* Header */}
        <div className='text-center mb-8'>
          <Title text1={"CHECKOUT"} text2={""}/>
          <p className='text-slate-400 mt-2'>Complete your order</p>
        </div>

        <form onSubmit={onSubmitHandler}>
          <div className='grid lg:grid-cols-2 gap-8'>
            
            {/* Left: Delivery Information */}
            <div className='space-y-6'>
              <div className='bg-slate-900 border border-slate-800 rounded-lg p-6'>
                <h3 className='text-white text-xl font-bold mb-6'>Delivery Information</h3>
                
                <div className='space-y-4'>
                  {/* Name */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='text-slate-400 text-sm mb-2 block'>First Name</label>
                      <input
                        type="text"
                        name='firstName'
                        value={formData.firstName}
                        onChange={onChangeHandler}
                        required
                        className='w-full h-12 bg-slate-950 border border-slate-800 rounded-lg px-4 text-white placeholder-slate-500 focus:outline-none focus:border-violet-600 transition-colors'
                        placeholder='John'
                      />
                    </div>
                    <div>
                      <label className='text-slate-400 text-sm mb-2 block'>Last Name</label>
                      <input
                        type="text"
                        name='lastName'
                        value={formData.lastName}
                        onChange={onChangeHandler}
                        required
                        className='w-full h-12 bg-slate-950 border border-slate-800 rounded-lg px-4 text-white placeholder-slate-500 focus:outline-none focus:border-violet-600 transition-colors'
                        placeholder='Doe'
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className='text-slate-400 text-sm mb-2 block'>Email Address</label>
                    <input
                      type="email"
                      name='email'
                      value={formData.email}
                      onChange={onChangeHandler}
                      required
                      className='w-full h-12 bg-slate-950 border border-slate-800 rounded-lg px-4 text-white placeholder-slate-500 focus:outline-none focus:border-violet-600 transition-colors'
                      placeholder='john@example.com'
                    />
                  </div>

                  {/* Street */}
                  <div>
                    <label className='text-slate-400 text-sm mb-2 block'>Street Address</label>
                    <input
                      type="text"
                      name='street'
                      value={formData.street}
                      onChange={onChangeHandler}
                      required
                      className='w-full h-12 bg-slate-950 border border-slate-800 rounded-lg px-4 text-white placeholder-slate-500 focus:outline-none focus:border-violet-600 transition-colors'
                      placeholder='123 Main Street'
                    />
                  </div>

                  {/* City & State */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='text-slate-400 text-sm mb-2 block'>City</label>
                      <input
                        type="text"
                        name='city'
                        value={formData.city}
                        onChange={onChangeHandler}
                        required
                        className='w-full h-12 bg-slate-950 border border-slate-800 rounded-lg px-4 text-white placeholder-slate-500 focus:outline-none focus:border-violet-600 transition-colors'
                        placeholder='Mumbai'
                      />
                    </div>
                    <div>
                      <label className='text-slate-400 text-sm mb-2 block'>State</label>
                      <input
                        type="text"
                        name='state'
                        value={formData.state}
                        onChange={onChangeHandler}
                        required
                        className='w-full h-12 bg-slate-950 border border-slate-800 rounded-lg px-4 text-white placeholder-slate-500 focus:outline-none focus:border-violet-600 transition-colors'
                        placeholder='Maharashtra'
                      />
                    </div>
                  </div>

                  {/* Pincode & Country */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='text-slate-400 text-sm mb-2 block'>Pincode</label>
                      <input
                        type="text"
                        name='pincode'
                        value={formData.pincode}
                        onChange={onChangeHandler}
                        required
                        className='w-full h-12 bg-slate-950 border border-slate-800 rounded-lg px-4 text-white placeholder-slate-500 focus:outline-none focus:border-violet-600 transition-colors'
                        placeholder='400001'
                      />
                    </div>
                    <div>
                      <label className='text-slate-400 text-sm mb-2 block'>Country</label>
                      <input
                        type="text"
                        name='country'
                        value={formData.country}
                        onChange={onChangeHandler}
                        required
                        className='w-full h-12 bg-slate-950 border border-slate-800 rounded-lg px-4 text-white placeholder-slate-500 focus:outline-none focus:border-violet-600 transition-colors'
                        placeholder='India'
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className='text-slate-400 text-sm mb-2 block'>Phone Number</label>
                    <input
                      type="tel"
                      name='phone'
                      value={formData.phone}
                      onChange={onChangeHandler}
                      required
                      className='w-full h-12 bg-slate-950 border border-slate-800 rounded-lg px-4 text-white placeholder-slate-500 focus:outline-none focus:border-violet-600 transition-colors'
                      placeholder='+91 1234567890'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Order Summary & Payment */}
            <div className='space-y-6'>
              
              {/* Cart Total */}
              <CartTotal />

              {/* Payment Method */}
              <div className='bg-slate-900 border border-slate-800 rounded-lg p-6'>
                <h3 className='text-white text-xl font-bold mb-6'>Payment Method</h3>
                
                <div className='space-y-4'>
                  
                  {/* Razorpay */}
                  <button
                    type='button'
                    onClick={() => setMethod('razorpay')}
                    className={`w-full h-20 bg-slate-950 border-2 rounded-lg p-4 transition-all ${
                      method === 'razorpay'
                        ? 'border-violet-600 bg-violet-600/10'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={razorpay}
                      className="h-full mx-auto object-contain"
                      alt="Razorpay"
                    />
                  </button>

                  {/* Cash on Delivery */}
                  <button
                    type='button'
                    onClick={() => setMethod('cod')}
                    className={`w-full h-20 border-2 rounded-lg flex items-center justify-center font-bold text-lg transition-all ${
                      method === 'cod'
                        ? 'border-violet-600 bg-violet-600/10 text-violet-400'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    💵 CASH ON DELIVERY
                  </button>
                </div>
              </div>

              {/* Place Order Button - ✅ Hover works properly now */}
              <button
                type="submit"
                disabled={loading}
                className='w-full h-14 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-violet-600 disabled:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg rounded-lg transition-all flex items-center justify-center shadow-lg shadow-violet-500/30'
              >
                {loading ? (
                  <div className='w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                ) : (
                  'PLACE ORDER'
                )}
              </button>

              {/* Security Badge */}
              <div className='flex items-center justify-center gap-2 text-slate-500 text-sm'>
                <span>🔒</span>
                <span>Secure checkout - Your data is protected</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PlaceOrder