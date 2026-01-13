import React, { useState } from 'react'
import { FiMail, FiSend, FiCheck } from 'react-icons/fi'

function NewLetterBox() {
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!email) return

        setIsSubmitted(true)
        setEmail('')
        
        setTimeout(() => setIsSubmitted(false), 3000)
    }

    return (
        <div className='relative w-full py-20 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 overflow-hidden'>
            
            {/* Background Blobs */}
            <div className='absolute top-20 left-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl'></div>
            <div className='absolute bottom-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl'></div>

            <div className='relative z-10 max-w-3xl mx-auto px-4 text-center'>
                
                {/* Icon */}
                <div className='w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/30'>
                    <FiMail className='w-8 h-8 text-white' />
                </div>

                {/* Heading */}
                <h2 className='text-3xl md: text-4xl font-bold text-white mb-4'>
                    Get <span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400'>20% Off</span> Your First Order
                </h2>
                <p className='text-slate-400 text-lg mb-8'>
                    Subscribe for exclusive deals and early access to new collections.
                </p>

                {/* Form */}
                {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-3 max-w-lg mx-auto'>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className='flex-1 h-14 bg-slate-800/50 border-2 border-slate-700/50 rounded-xl text-white placeholder-slate-500 px-4 focus:outline-none focus:border-cyan-500 transition-all duration-300'
                        />
                        <button
                            type='submit'
                            className='px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/30 hover: shadow-cyan-500/50 transition-all duration-300 flex items-center justify-center gap-2'
                        >
                            Subscribe
                            <FiSend className='w-4 h-4' />
                        </button>
                    </form>
                ) : (
                    <div className='animate-fade-in'>
                        <div className='w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <FiCheck className='w-8 h-8 text-white' />
                        </div>
                        <p className='text-white text-xl font-semibold'>Thank you for subscribing!</p>
                    </div>
                )}

                {/* Trust Line */}
                <p className='text-slate-500 text-sm mt-6'>
                    🔒 Your email is safe with us.  Unsubscribe anytime. 
                </p>
            </div>
        </div>
    )
}

export default NewLetterBox