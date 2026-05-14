import React from 'react'
import Aboutimg from "../assets/About.png"
import NewLetterBox from '../components/NewLetterBox'
import Footer from '../components/Footer'
import { FiCheckCircle, FiZap, FiHeadphones, FiTruck, FiShield, FiStar } from 'react-icons/fi'

const stats = [
  { value: '50K+', label: 'Products', icon: '🛍️' },
  { value: '1M+', label: 'Orders Delivered', icon: '📦' },
  { value: '100K+', label: 'Happy Customers', icon: '😊' },
  { value: '4.8★', label: 'Avg Rating', icon: '⭐' },
]

const values = [
  {
    icon: FiCheckCircle,
    color: 'bg-rose-50 text-[#ff3f6c]',
    title: 'Quality Assurance',
    desc: 'Every product goes through strict quality checks before it reaches you. We partner with only trusted brands and verified sellers.',
  },
  {
    icon: FiZap,
    color: 'bg-amber-50 text-amber-500',
    title: 'Lightning Fast Delivery',
    desc: 'Same-day and next-day delivery available in 50+ cities. Your order is always our priority from the moment you click "Buy".',
  },
  {
    icon: FiHeadphones,
    color: 'bg-violet-50 text-violet-600',
    title: 'Exceptional Support',
    desc: '24/7 customer support via chat, email, and phone. Our dedicated team is always ready to resolve any issue instantly.',
  },
]

function About() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-rose-50 via-white to-pink-50 pt-16 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <span className="inline-block bg-[#ff3f6c]/10 text-[#ff3f6c] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                About OneCart
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                India's Smarter Way to Shop
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                OneCart was born for smart, seamless shopping — created to deliver quality products, trending styles, and everyday essentials in one place.
              </p>
              <p className="text-gray-600 leading-relaxed">
                With reliable service, fast delivery, and great value, OneCart makes your online shopping experience simple, satisfying, and stress-free.
              </p>

              {/* Mission highlight */}
              <div className="mt-8 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <FiStar className="w-4 h-4 text-[#ff3f6c]" />
                  Our Mission
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  To redefine online shopping by delivering quality, affordability, and convenience — connecting customers with trusted products in a customer-first experience that saves time and adds value to every lifestyle.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="relative flex justify-center">
              <div className="relative">
                <img
                  src={Aboutimg}
                  alt="About OneCart"
                  className="w-full max-w-sm rounded-2xl shadow-2xl object-cover"
                />
                {/* Floating badge */}
                <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                  <p className="text-2xl font-extrabold text-gray-900">5+ Yrs</p>
                  <p className="text-xs text-gray-500 font-medium">Of Trust & Service</p>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#ff3f6c] rounded-2xl opacity-20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-[#ff3f6c] py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center">
            {stats.map(({ value, label, icon }) => (
              <div key={label}>
                <div className="text-3xl mb-1">{icon}</div>
                <div className="text-3xl font-extrabold">{value}</div>
                <div className="text-rose-100 text-sm font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block bg-[#ff3f6c]/10 text-[#ff3f6c] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
              Why OneCart
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900">Built for the Modern Shopper</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Everything you need for a seamless, satisfying shopping experience.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, color, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-gray-100 p-7 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-5`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-[#ff3f6c] transition-colors">
                  {title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policies strip */}
      <section className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: FiTruck, label: 'Free Delivery', sub: 'On orders ₹499+' },
              { icon: FiShield, label: 'Secure Payments', sub: '100% protected' },
              { icon: '🔄', label: '14-Day Returns', sub: 'No questions asked' },
              { icon: FiHeadphones, label: '24/7 Support', sub: 'Always here' },
            ].map(({ icon: Icon, label, sub }, i) => (
              <div key={label} className="flex flex-col items-center gap-2">
                {typeof Icon === 'string' ? (
                  <span className="text-2xl">{Icon}</span>
                ) : (
                  <div className="w-10 h-10 bg-[#ff3f6c]/10 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#ff3f6c]" />
                  </div>
                )}
                <p className="font-bold text-gray-900 text-sm">{label}</p>
                <p className="text-gray-500 text-xs">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NewLetterBox />
      <Footer />
    </div>
  )
}

export default About