import React, { useState } from 'react'
import contact from "../assets/contact.jpg"
import NewLetterBox from '../components/NewLetterBox'
import Footer from '../components/Footer'
import { FiMapPin, FiPhone, FiMail, FiBriefcase, FiSend, FiClock } from 'react-icons/fi'

const contactInfo = [
  {
    icon: FiMapPin,
    color: 'bg-rose-50 text-[#ff3f6c]',
    title: 'Our Store',
    lines: ['12345 Pune, Maharashtra', 'India — 411001'],
  },
  {
    icon: FiPhone,
    color: 'bg-emerald-50 text-emerald-600',
    title: 'Phone',
    lines: ['+91 12345 67890', 'Mon – Sat, 9 AM – 7 PM'],
  },
  {
    icon: FiMail,
    color: 'bg-violet-50 text-violet-600',
    title: 'Email',
    lines: ['admin@onecart.com', 'support@onecart.com'],
  },
  {
    icon: FiClock,
    color: 'bg-amber-50 text-amber-500',
    title: 'Working Hours',
    lines: ['Mon – Fri: 9 AM – 8 PM', 'Sat – Sun: 10 AM – 6 PM'],
  },
]

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate sending
    setSent(true)
    setTimeout(() => setSent(false), 4000)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-50 via-white to-pink-50 pt-16 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-[#ff3f6c]/10 text-[#ff3f6c] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            Get in Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            We'd Love to Hear From You
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Have a question, feedback, or just want to say hi? Our team is always happy to help.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Contact form */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h2 className="font-bold text-gray-900 text-xl mb-6 flex items-center gap-2">
              <FiSend className="w-5 h-5 text-[#ff3f6c]" />
              Send us a Message
            </h2>

            {sent && (
              <div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-xl px-4 py-3 flex items-center gap-2">
                ✅ Message sent! We'll get back to you within 24 hours.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Name</label>
                  <input
                    type="text" required
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full h-11 border border-gray-300 rounded-lg px-3.5 text-sm focus:outline-none focus:border-[#ff3f6c] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
                  <input
                    type="email" required
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full h-11 border border-gray-300 rounded-lg px-3.5 text-sm focus:outline-none focus:border-[#ff3f6c] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Subject</label>
                <input
                  type="text" required
                  value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="How can we help?"
                  className="w-full h-11 border border-gray-300 rounded-lg px-3.5 text-sm focus:outline-none focus:border-[#ff3f6c] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Message</label>
                <textarea
                  rows={5} required
                  value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Write your message here..."
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-3 text-sm resize-none focus:outline-none focus:border-[#ff3f6c] transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full h-11 bg-[#ff3f6c] hover:bg-[#e8365d] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#ff3f6c]/20"
              >
                <FiSend className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>

          {/* Right panel: image + info */}
          <div className="space-y-5">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden h-52">
              <img src={contact} alt="Contact" className="w-full h-full object-cover" />
            </div>

            {/* Contact info cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map(({ icon: Icon, color, title, lines }) => (
                <div key={title} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                  <div className={`w-9 h-9 ${color} rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <p className="font-bold text-gray-900 text-sm mb-1">{title}</p>
                  {lines.map((l, i) => (
                    <p key={i} className="text-gray-500 text-xs">{l}</p>
                  ))}
                </div>
              ))}
            </div>

            {/* Careers CTA */}
            <div className="bg-gradient-to-br from-[#ff3f6c] to-rose-500 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <FiBriefcase className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-lg">Join Our Team!</p>
                  <p className="text-rose-100 text-sm">We're hiring passionate people</p>
                </div>
              </div>
              <p className="text-rose-100 text-sm mb-4">
                Love e-commerce? We're always looking for talented individuals to join the OneCart family.
              </p>
              <button className="bg-white text-[#ff3f6c] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-rose-50 transition-colors">
                View Open Positions →
              </button>
            </div>
          </div>
        </div>
      </section>

      <NewLetterBox />
      <Footer />
    </div>
  )
}

export default Contact