import { Link } from 'react-router-dom'

const TIMELINE = [
  { year: 'The Beginning (1994)', desc: 'Bansal Fireworks was established by our founders to provide premium quality, safe fireworks to consumers across India.' },
  { year: 'Industrial Expansion (2005)', desc: 'We expanded our operations to a state-of-the-art manufacturing facility in Sivakasi, Tamil Nadu.' },
  { year: 'Safety Standards (2018)', desc: 'Recognised as an industry leader with international safety accreditations.' },
]

const PILLARS = [
  { color: 'bg-blue-500', icon: '🛡️', title: 'Safety First', desc: 'Safety isn\'t just a promise; it\'s our culture. Every single product we create undergoes rigorous testing to exceed international safety standards.' },
  { color: 'bg-orange-400', icon: '⭐', title: 'Premium Quality', desc: 'We source the finest chemicals and materials, always striving to elevate colours, noise and performance globally to stand out anywhere in the world.' },
  { color: 'bg-green-400', icon: '🌿', title: 'Eco-Innovation', desc: 'Committed to sustainability, our research and innovation team develop eco-conscious formulas for a cleaner environment.' },
]

const STATS = [
  { val: '30+', label: 'Years Experience' },
  { val: '500+', label: 'Products' },
  { val: '12M+', label: 'Happy Customers' },
  { val: '0', label: 'Safety Incidents' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section
        className="relative bg-gray-900 text-white py-24 px-4 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gray-900/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            🏭 EST. 1994 · SIVAKASI
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4 max-w-2xl">
            Crafting Moments of Pure Wonder
          </h1>
          <p className="text-gray-300 text-lg max-w-xl">
            Celebrating three decades of safety, quality, and pyrotechnic artistry.
          </p>
        </div>
      </section>

      {/* Our Legacy */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Legacy of Excellence</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Since our inception in 1994, Bansal Fireworks has been at the forefront of the pyrotechnics industry. What started as a small family-run workshop has transformed into a national leader in high-performance pyrotechnics, driven by a relentless pursuit of manufacturing perfection.
              </p>
              {/* Timeline */}
              <div className="flex flex-col gap-6">
                {TIMELINE.map((t, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{i + 1}</span>
                      </div>
                      {i < TIMELINE.length - 1 && <div className="w-px flex-1 bg-blue-200 mt-2" />}
                    </div>
                    <div className="pb-6">
                      <h3 className="text-gray-900 font-semibold text-sm mb-1">{t.year}</h3>
                      <p className="text-gray-500 text-sm">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
                alt="Bansal Fireworks team members at the Sivakasi factory"
                loading="lazy"
                className="rounded-xl object-cover h-48 w-full"
              />
              <img
                src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80"
                alt="Bansal Fireworks manufacturing facility"
                loading="lazy"
                className="rounded-xl object-cover h-48 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Philosophy */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Core Philosophy</h2>
            <div className="w-8 h-1 bg-blue-600 rounded mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PILLARS.map(pillar => (
              <div key={pillar.title} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className={`w-10 h-10 ${pillar.color} rounded-xl flex items-center justify-center text-white text-xl mb-4`} aria-hidden="true">
                  {pillar.icon}
                </div>
                <h3 className="text-gray-900 font-bold text-base mb-3">{pillar.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{s.val}</div>
                <div className="text-blue-200 text-sm uppercase tracking-wide font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
