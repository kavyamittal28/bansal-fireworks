import { useState } from 'react'

const INQUIRY_TYPES = [
  'I want to buy for a wedding',
  'I want to buy for a birthday',
  'I want to buy for a festival / Diwali',
  'I need a large quantity for my shop',
  'I have a general question',
  'Other',
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', type: '', message: '', agree: false })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4 border border-amber-200">
            💬 We'd Love to Hear From You
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Get in Touch</h1>
          <p className="text-gray-500 text-base max-w-xl">
            Whether you want to buy, ask a question, or get a price for a big order — just reach out! We're friendly and very quick to reply.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Sidebar: Contact Details */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <h2 className="text-lg font-bold text-gray-800">Ways to Reach Us</h2>

            {/* Phone – highlighted as primary */}
            <a href="tel:+919876543210" className="flex items-center gap-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl p-5 shadow-sm transition-all group">
              <div className="text-3xl">📞</div>
              <div>
                <div className="font-bold text-sm">Call Us Directly</div>
                <div className="text-amber-100 text-lg font-extrabold">+91 98765 43210</div>
                <div className="text-amber-200 text-xs mt-0.5">Mon–Sat, 9 AM – 7 PM</div>
              </div>
            </a>

            <a href="mailto:sales@bansalfireworks.com" className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-amber-300 transition-all">
              <div className="text-3xl">✉️</div>
              <div>
                <div className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Email</div>
                <div className="text-gray-800 font-semibold text-sm">sales@bansalfireworks.com</div>
              </div>
            </a>

            <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="text-3xl">📍</div>
              <div>
                <div className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">Our Location</div>
                <div className="text-gray-800 font-semibold text-sm leading-relaxed">
                  123 Fireworks Industrial Area,<br/>
                  Sivakasi, Tamil Nadu, India
                </div>
              </div>
            </div>

            {/* Reassurance */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">⚡</span>
                <span className="text-green-800 font-bold text-sm">Quick Response Guarantee</span>
              </div>
              <p className="text-green-700 text-sm leading-relaxed">
                We usually reply to messages within <strong>2–4 hours</strong> on working days. Phone calls are answered instantly!
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">
                <div className="text-6xl mb-5">🎉</div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Message Sent!</h2>
                <p className="text-gray-500 text-base mb-6">
                  Thank you for getting in touch! We'll reply within a few hours. Or give us a call if it's urgent.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-all"
                  >
                    Send Another Message
                  </button>
                  <a href="tel:+919876543210" className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-6 py-3 rounded-xl transition-all">
                    📞 Call Us Now
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} id="contact-form" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col gap-5">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 mb-1">Send Us a Message</h2>
                  <p className="text-gray-400 text-sm">Fill in the form below and we'll be in touch soon 😊</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-gray-700 text-sm font-semibold">Your Name *</label>
                    <input
                      id="name" name="name" required
                      value={form.name} onChange={handleChange}
                      placeholder="e.g. Ramesh Sharma"
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="text-gray-700 text-sm font-semibold">Your Mobile Number *</label>
                    <input
                      id="phone" name="phone" type="tel" required
                      value={form.phone} onChange={handleChange}
                      placeholder="e.g. 99887 76655"
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-gray-700 text-sm font-semibold">Email Address <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input
                    id="email" name="email" type="email"
                    value={form.email} onChange={handleChange}
                    placeholder="you@example.com"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="type" className="text-gray-700 text-sm font-semibold">What are you buying for? *</label>
                  <select
                    id="type" name="type" required
                    value={form.type} onChange={handleChange}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all cursor-pointer"
                  >
                    <option value="">Choose an option...</option>
                    {INQUIRY_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-gray-700 text-sm font-semibold">Your Message *</label>
                  <textarea
                    id="message" name="message" required rows={4}
                    value={form.message} onChange={handleChange}
                    placeholder="Tell us what you need — how many products, your budget, when you need it, etc."
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-none"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox" id="agree" name="agree" required
                    checked={form.agree} onChange={handleChange}
                    className="mt-0.5 w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                  <label htmlFor="agree" className="text-gray-500 text-sm leading-relaxed cursor-pointer">
                    I agree to the <a href="#" className="text-amber-600 underline">Terms of Service</a> and <a href="#" className="text-amber-600 underline">Privacy Policy</a>
                  </label>
                </div>

                <button
                  type="submit"
                  id="submit-contact"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-base py-4 rounded-2xl shadow-sm transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  📨 Send My Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
