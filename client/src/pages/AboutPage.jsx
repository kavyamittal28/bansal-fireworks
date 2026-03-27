import { Link } from 'react-router-dom'

const TIMELINE = [
  { year: 'The Beginning (1994)', desc: 'Bansal Fireworks was established by our founders to provide premium quality, safe fireworks to consumers across India.' },
  { year: 'Industrial Expansion (2005)', desc: 'We expanded our operations to a state-of-the-art manufacturing facility in Sadulshahar, Rajasthan.' },
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
        className="relative bg-gray-900 text-white py-20 sm:py-32 px-4 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gray-900/75" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-full mb-8 tracking-wide">
            🏭 Est. 1994 · Sadulshahar, Rajasthan
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-6 max-w-3xl">
            Crafting Moments of Pure Wonder
          </h1>
          <p className="text-gray-200 text-base sm:text-lg max-w-2xl leading-relaxed">
            Celebrating three decades of safety, innovation, and pyrotechnic excellence. Your trust is our tradition.
          </p>
        </div>
      </section>

      {/* Our Legacy */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mb-3">Our Journey</p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-6">Legacy of Excellence</h2>
              <p className="text-gray-600 text-base leading-relaxed mb-8">
                Since our inception in 1994, Bansal Fireworks has been at the forefront of the pyrotechnics industry. What started as a small family-run workshop has transformed into a national leader in high-performance pyrotechnics, driven by a relentless pursuit of manufacturing perfection.
              </p>
              {/* Timeline */}
              <div className="flex flex-col gap-8">
                {TIMELINE.map((t, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-white text-sm font-bold">{i + 1}</span>
                      </div>
                      {i < TIMELINE.length - 1 && <div className="w-px flex-1 bg-amber-200 mt-3" />}
                    </div>
                    <div className="pb-8">
                      <h3 className="text-gray-900 font-bold text-base mb-2">{t.year}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
                alt="Bansal Fireworks team members at the Sadulshahar facility"
                loading="lazy"
                className="rounded-xl object-cover h-36 sm:h-48 w-full"
              />
              <img
                src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80"
                alt="Bansal Fireworks manufacturing facility"
                loading="lazy"
                className="rounded-xl object-cover h-36 sm:h-48 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Philosophy */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mb-3">Our Values</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-5">Core Philosophy</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {PILLARS.map(pillar => (
              <div key={pillar.title} className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`w-14 h-14 ${pillar.color} rounded-xl flex items-center justify-center text-white text-3xl mb-6 shadow-lg`} aria-hidden="true">
                  {pillar.icon}
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-4">{pillar.title}</h3>
                <p className="text-gray-600 text-base leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-3xl sm:text-5xl font-bold text-white mb-3">{s.val}</div>
                <div className="text-amber-100 text-xs sm:text-sm uppercase tracking-widest font-bold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
