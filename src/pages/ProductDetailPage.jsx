import { useParams, Link } from 'react-router-dom'

const PRODUCTS = {
  1: { name: 'Classic Sparklers', emoji: '✨', category: 'Sparklers', price: '₹180', unit: 'per box (50 pcs)', minOrder: '10 boxes', brand: 'Bansal Classic', tag: '⭐ Favourite', desc: 'Traditional wire sparklers with a 45-second burn time. Perfect for birthday cakes, indoor celebrations, and family moments. Very easy and safe to use — just light and enjoy!', specs: [['Burn Time', '45 seconds'], ['Pack Size', '50 pieces'], ['Spark Colour', 'Warm Gold'], ['Best For', 'Birthdays & Cakes'], ['Safety Class', 'Class 1 (Safest)'], ['Net Weight', '250g']], safetyTip: 'Hold at arm\'s length. Don\'t hold near your face. Keep away from clothing and hair.' },
  2: { name: 'Aerial Sky Shots', emoji: '🚀', category: 'Aerial Shows', price: '₹850', unit: 'per pack (6 pcs)', minOrder: '5 packs', brand: 'Bansal Pro', tag: '🔥 Wow Factor', desc: 'Spectacular multi-coloured explosions that burst high in the sky. 18 shots per unit reaching up to 40 metres. Truly unforgettable — the highlight of any wedding or festival.', specs: [['Number of Shots', '18 shots'], ['Maximum Height', '40 metres'], ['Burst Colours', 'Multi-colour'], ['Duration', 'About 30 seconds'], ['Best For', 'Weddings & Events'], ['Safety Class', 'Class 3']], safetyTip: 'Only use in open outdoor areas. Keep everyone at least 30 metres away. Never lean over the tube.' },
  3: { name: 'Ground Spinners', emoji: '🌀', category: 'Ground Shows', price: '₹320', unit: 'per set (12 pcs)', minOrder: '8 sets', brand: 'Bansal Classic', tag: '✨ New', desc: 'Fast-spinning showers of colourful sparks at ground level. Perfect for garden parties and outdoor events. Kids and adults alike love watching them spin!', specs: [['Duration', '60 seconds'], ['Colours', 'Multi-colour'], ['Height', 'Ground level'], ['Pack Size', '12 pieces'], ['Best For', 'Garden Parties'], ['Safety Class', 'Class 1']], safetyTip: 'Place on a hard, flat surface. Keep away from dry grass or plants.' },
  4: { name: 'Chakra Wheel', emoji: '🎡', category: 'Ground Shows', price: '₹220', unit: 'per wheel', minOrder: '20 units', brand: 'Bansal Classic', tag: null, desc: 'A beautiful spinning wheel of red and green stars. Simply nail it to a fence or wooden post and light it. Burns for a full 90 seconds of gorgeous colour.', specs: [['Duration', '90 seconds'], ['Colours', 'Red & Green'], ['Wheel Size', '30 cm'], ['How to Mount', 'Nail or post'], ['Best For', 'Garden Decor'], ['Safety Class', 'Class 1']], safetyTip: 'Mount firmly before lighting. Stand at least 5 metres away once lit.' },
  5: { name: 'Giant Flower Pot', emoji: '🌸', category: 'Novelty', price: '₹390', unit: 'per unit', minOrder: '12 units', brand: 'Bansal Pro', tag: '💛 Great Value', desc: 'A giant golden sparks fountain that shoots up to 3 metres high. Gorgeous for photos and video. It stands on its own — just place it and light it!', specs: [['Duration', '75 seconds'], ['Spark Height', 'Up to 3 metres'], ['Colour', 'Warm Gold'], ['Standing', 'Self-standing'], ['Best For', 'Photos & Events'], ['Safety Class', 'Class 2']], safetyTip: 'Place on a stable, flat surface. Keep a 5-metre clear area around it.' },
  6: { name: 'Green Hydro Bomb', emoji: '💚', category: 'Aerial Shows', price: '₹480', unit: 'per pack (4 pcs)', minOrder: '6 packs', brand: 'Bansal Pro', tag: '👍 Popular', desc: 'Green whistling bombs with a dramatic burst and waterfall effect. Great for creating an exciting sequence at any celebration.', specs: [['Duration', '5 seconds'], ['Colour', 'Bright Green'], ['Altitude', 'About 25 metres'], ['Effect', 'Whistle + Burst'], ['Pack Size', '4 pieces'], ['Safety Class', 'Class 3']], safetyTip: 'Must use in open outdoor areas. Minimum 20m clearance from people.' },
  7: { name: 'Bullet Bomb Pack', emoji: '💥', category: 'Aerial Shows', price: '₹560', unit: 'per pack (10 pcs)', minOrder: '5 packs', brand: 'Bansal Pro', tag: null, desc: 'Powerful aerial shells that go up with a loud burst and shower down with silver stars. Makes a big impact at any outdoor celebration.', specs: [['Shells per Pack', '10 shells'], ['Altitude', 'About 30 metres'], ['Colour', 'Silver'], ['Best For', 'Outdoor Events'], ['Calibre', '50mm'], ['Safety Class', 'Class 3']], safetyTip: 'Outdoor use only. Need 30m safe distance from spectators.' },
  8: { name: 'Sky Shot 12 Chimes', emoji: '🎇', category: 'Aerial Shows', price: '₹640', unit: 'per unit', minOrder: '4 units', brand: 'Bansal Pro', tag: '👍 Popular', desc: '12 beautiful aerial blasts with musical chime sounds and a glitter finale. One of our most-loved products — a guaranteed crowd-pleaser at any event.', specs: [['Number of Shots', '12 shots'], ['Duration', 'About 45 seconds'], ['Colours', 'Multi-colour'], ['Special Effect', 'Musical Chimes'], ['Best For', 'Weddings & Parties'], ['Safety Class', 'Class 3']], safetyTip: 'Open outdoor areas only. Keep 30m distance. Never stand above it.' },
}

const RELATED_IDS = [1, 3, 5]

export default function ProductDetailPage() {
  const { id } = useParams()
  const p = PRODUCTS[parseInt(id)] || PRODUCTS[8]

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-400">
            <Link to="/" className="hover:text-amber-600 transition-colors">Home</Link>
            <span>›</span>
            <Link to="/products" className="hover:text-amber-600 transition-colors">Products</Link>
            <span>›</span>
            <span className="text-gray-700 font-medium">{p.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Visual */}
          <div className="flex flex-col gap-5">
            <div className="bg-amber-50 rounded-3xl h-72 flex items-center justify-center text-9xl border border-amber-100 shadow-sm">
              {p.emoji}
            </div>
            {/* Safety Tip */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 flex gap-4">
              <span className="text-2xl flex-shrink-0">⚠️</span>
              <div>
                <p className="text-orange-800 font-bold text-sm mb-1">Safety Reminder</p>
                <p className="text-orange-700 text-sm leading-relaxed">{p.safetyTip}</p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            {p.tag && (
              <span className="self-start bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full">
                {p.tag}
              </span>
            )}

            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">{p.name}</h1>
              <p className="text-amber-600 font-semibold text-sm uppercase tracking-wide mb-4">{p.category}</p>
              <p className="text-gray-600 text-base leading-relaxed">{p.desc}</p>
            </div>

            {/* Price Box */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-between gap-4 shadow-sm">
              <div>
                <div className="text-3xl font-extrabold text-gray-900">{p.price}</div>
                <div className="text-gray-400 text-sm">{p.unit}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-0.5">Minimum Order</div>
                <div className="font-semibold text-gray-700 text-sm">{p.minOrder}</div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-200">
                ✅ Safety Certified
              </span>
              <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200">
                📦 In Stock
              </span>
              <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-200">
                ⚡ Brand: {p.brand}
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/contact"
                className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl shadow-sm transition-all text-base"
                id="request-quote-btn"
              >
                📋 Ask for a Price Quote
              </Link>
              <a
                href="tel:+919876543210"
                className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-bold py-4 rounded-2xl border-2 border-gray-200 shadow-sm transition-all text-base"
                id="call-about-product-btn"
              >
                📞 Call to Order
              </a>
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-12 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-gray-700 font-bold text-sm uppercase tracking-wide">Quick Details</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3">
            {p.specs.map(([k, v], i) => (
              <div key={k} className={`p-5 ${i < p.specs.length - (p.specs.length % 3 === 0 ? 3 : p.specs.length % 3) ? 'border-b border-gray-100' : ''} ${(i + 1) % 3 !== 0 ? 'border-r border-gray-100' : ''}`}>
                <div className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1">{k}</div>
                <div className="text-gray-800 font-semibold text-sm">{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Related */}
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {RELATED_IDS.map(rid => {
              const rp = PRODUCTS[rid]
              if (!rp || rid === parseInt(id)) return null
              return (
                <Link to={`/products/${rid}`} key={rid} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-4 p-4">
                  <div className="bg-amber-50 w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">{rp.emoji}</div>
                  <div>
                    <div className="text-gray-900 font-bold text-sm">{rp.name}</div>
                    <div className="text-amber-600 font-extrabold text-base">{rp.price}</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
