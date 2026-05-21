import React, { useState } from 'react'
import { FiMail, FiSend, FiCheck } from 'react-icons/fi'

function NewLetterBox() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setEmail('')
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <section className="relative w-full py-14 sm:py-20 bg-gradient-to-br from-[#ff3f6c] to-rose-500 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5 backdrop-blur-sm">
          <FiMail className="w-7 h-7 text-white" />
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3">
          Get <span className="underline decoration-white/50">20% Off</span> Your First Order
        </h2>
        <p className="text-rose-100 text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
          Subscribe for exclusive deals and early access to new collections.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email" required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-white/90 border-2 border-white/50 rounded-xl px-4 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-white focus:bg-white transition-all py-3.5"
            />
            <button
              type="submit"
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl px-6 flex items-center justify-center gap-2 transition-colors shadow-lg py-3.5 whitespace-nowrap"
            >
              Subscribe <FiSend className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
              <FiCheck className="w-7 h-7 text-emerald-500" />
            </div>
            <p className="text-white text-xl font-bold">You're subscribed! 🎉</p>
            <p className="text-rose-100 text-sm">Check your inbox for your 20% off code.</p>
          </div>
        )}

        <p className="text-rose-200 text-xs mt-5">
          🔒 Your email is safe with us. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}

export default NewLetterBox
