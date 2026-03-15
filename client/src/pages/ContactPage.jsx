import { useState } from 'react'

const CONTACT_INFO = [
  { icon: '📍', label: 'Our Location', value: 'Sadulshahar, Sri Ganganagar,\nRajasthan 335062', href: null },
  { icon: '📞', label: 'Phone Number', value: '+91 95876 38000\nMon–Sat, 9:00 AM – 7:00 PM', href: 'tel:+919587638000' },
  { icon: '✉️', label: 'Email Address', value: 'Nikhilbnsl380@gmail.com', href: 'mailto:Nikhilbnsl380@gmail.com' },
]

const REQUIREMENT_OPTIONS = [
  'Wholesale Order', 'Retail Inquiry', 'Event Display', 'Custom Order', 'General Inquiry',
]

function validateForm(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Full name is required.'
  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required.'
  } else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ''))) {
    errors.phone = 'Enter a valid 10-digit Indian mobile number.'
  }
  if (!form.message.trim()) errors.message = 'Please describe your requirement.'
  return errors
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', requirement: 'Wholesale Order', message: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear error as user types
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validateForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      // Focus first error field
      const firstKey = Object.keys(validationErrors)[0]
      document.getElementById(firstKey)?.focus()
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/add-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Server error')
      setSuccess(true)
    } catch {
      setErrors({ form: 'Something went wrong. Please try again or call us directly.' })
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setForm({ name: '', phone: '', requirement: 'Wholesale Order', message: '' })
    setErrors({})
    setSuccess(false)
  }

  const inputClass = (field) =>
    `w-full border rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
      errors[field]
        ? 'border-red-300 focus:ring-red-400 bg-red-50'
        : 'border-gray-300 focus:ring-blue-500'
    }`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl">
            We're here to help with your wholesale and retail firework inquiries. Reach out via the form or visit our facility in Sadulshahar.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left: Contact details + Map */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Our Contact Details</h2>
              <div className="flex flex-col gap-5">
                {CONTACT_INFO.map(info => (
                  <div key={info.label} className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 text-base" aria-hidden="true">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold text-sm">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} className="text-gray-500 text-sm whitespace-pre-line mt-0.5 hover:text-blue-600 transition-colors">
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-gray-500 text-sm whitespace-pre-line mt-0.5">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden h-48 sm:h-64">
              <iframe
                title="Map showing Bansal Fireworks location in Sadulshahar, Sri Ganganagar, Rajasthan"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56177.18!2d74.0!3d29.45!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3917fa9b4d4e5555%3A0x1!2sSadulshahar%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
            {success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl" aria-hidden="true">
                  ✅
                </div>
                <h3 className="text-gray-900 font-bold text-xl mb-2">Inquiry Sent!</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
                  id="send-another-btn"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-base font-semibold text-gray-900 mb-1">Send an Inquiry</h2>
                <p className="text-gray-500 text-sm mb-6">Fill in the details below and we'll get back to you within 24 hours.</p>

                {errors.form && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-2" role="alert">
                    {errors.form}
                  </div>
                )}

                <form onSubmit={handleSubmit} id="contact-form" className="flex flex-col gap-5" noValidate>
                  {/* Full Name */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1.5" htmlFor="name">
                      Full Name <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Kumar"
                      className={inputClass('name')}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      autoComplete="name"
                    />
                    {errors.name && (
                      <p id="name-error" className="text-red-500 text-xs mt-1.5 flex items-center gap-1" role="alert">
                        ⚠ {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1.5" htmlFor="phone">
                      Phone Number <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      className={inputClass('phone')}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                      autoComplete="tel"
                      maxLength={10}
                    />
                    {errors.phone && (
                      <p id="phone-error" className="text-red-500 text-xs mt-1.5 flex items-center gap-1" role="alert">
                        ⚠ {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Requirement */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1.5" htmlFor="requirement">
                      Your Requirement
                    </label>
                    <div className="relative">
                      <select
                        id="requirement"
                        name="requirement"
                        value={form.requirement}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                      >
                        {REQUIREMENT_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▼</span>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1.5" htmlFor="message">
                      Message <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Describe your product requirements, quantity, event date, etc."
                      className={inputClass('message')}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                    />
                    {errors.message && (
                      <p id="message-error" className="text-red-500 text-xs mt-1.5 flex items-center gap-1" role="alert">
                        ⚠ {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm"
                    id="send-inquiry-btn"
                  >
                    {loading ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                        <span>Sending…</span>
                      </>
                    ) : (
                      'Send Inquiry →'
                    )}
                  </button>

                  <p className="text-gray-400 text-xs text-center">
                    <span className="text-red-500">*</span> Required fields
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
