import React from 'react'
import { RiExchangeFundsLine } from "react-icons/ri"
import { TbRosetteDiscountCheckFilled } from "react-icons/tb"
import { BiSupport } from "react-icons/bi"
import { FiTruck, FiShield } from 'react-icons/fi'

const policies = [
  {
    icon: RiExchangeFundsLine,
    bg: 'bg-rose-50',
    iconColor: 'text-[#ff3f6c]',
    title: 'Easy Exchange',
    desc: 'Changed your mind? Exchange made quick, simple, and completely hassle-free.',
  },
  {
    icon: TbRosetteDiscountCheckFilled,
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    title: '14-Day Returns',
    desc: 'Shop with confidence — enjoy our extended 14-day return guarantee on all orders.',
  },
  {
    icon: BiSupport,
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    title: '24/7 Support',
    desc: 'Our dedicated support team is available round the clock — your satisfaction matters.',
  },
]

const perks = [
  { icon: FiTruck, label: 'Free Delivery', sub: 'On ₹499+' },
  { icon: FiShield, label: 'Secure Payments', sub: '100% safe' },
  { icon: '🔄', label: 'Easy Returns', sub: '14-day policy' },
  { icon: '⭐', label: '4.8 Rating', sub: '1M+ reviews' },
]

function OurPolicy() {
  return (
    <section className="w-full py-12 md:py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[#ff3f6c] uppercase tracking-widest">Why Shop With Us</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">Our <span className="text-[#ff3f6c]">Promise</span></h2>
          <p className="text-gray-500 text-sm mt-2">Customer-first policies committed to your satisfaction</p>
        </div>

        {/* Policy cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
          {policies.map(({ icon: Icon, bg, iconColor, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-gray-100 p-7 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                <Icon className={`w-7 h-7 ${iconColor}`} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-[#ff3f6c] transition-colors">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Perks strip */}
        <div className="bg-[#ff3f6c] rounded-2xl py-5 px-4 sm:py-6 sm:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-white text-center">
            {perks.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 py-1">
                {typeof Icon === 'string' ? (
                  <span className="text-xl sm:text-2xl">{Icon}</span>
                ) : (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 rounded-full flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                )}
                <p className="font-bold text-xs sm:text-sm">{label}</p>
                <p className="text-rose-100 text-[10px] sm:text-xs">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurPolicy