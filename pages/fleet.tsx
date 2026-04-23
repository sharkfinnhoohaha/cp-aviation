import Head from 'next/head'
import Link from 'next/link'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import homeData from '../content/pages/home.json'

const s = homeData.siteSettings
const siteSettings = {
  companyName: s.companyName,
  logoText: s.logoText,
  contactEmail: s.contactEmail,
  phone: s.phoneDisplay ?? s.phone,
  location: s.location,
  copyrightYear: s.copyrightYear,
}

const footer = { ctaText: 'Cleared for Takeoff.', runwayNumber: '22' }

interface Aircraft {
  id: string
  registration: string
  type: string
  engine: string
  horsepower: string
  cruiseSpeed: string
  seats: string
  mission: string[]
  features: string[]
  rate: string
  category: string
  description: string
  color: string
}

const fleet: Aircraft[] = [
  {
    id: 'cessna-172',
    registration: 'Cessna Fleet',
    type: 'Cessna 172 Skyhawk',
    engine: 'Lycoming O-320 / O-360',
    horsepower: '160–180 HP',
    cruiseSpeed: '120 KTAS',
    seats: '4',
    mission: [
      'Private Pilot Certificate',
      'Instrument Rating',
      'Commercial & CFI training',
      'Rental for certificated pilots',
    ],
    features: [
      'High-wing tricycle gear',
      'Docile handling for first solos',
      'Ideal for Santa Paula traffic patterns',
      'Maintained in-house',
    ],
    rate: 'Contact for rates',
    category: 'Primary Trainer',
    description: 'The world\'s most popular training aircraft — and a backbone of our fleet since day one. Our Cessna 172 Skyhawks are dispatch-ready workhorses for Private, Instrument, Commercial and CFI training. Tricycle gear and forgiving handling make them the right airplane for your first solo — and for everything after. Every airframe is maintained by our in-house shop.',
    color: 'bg-[#EEF2F8] border-[#D6DEEB]',
  },
  {
    id: 'citabria-7eca',
    registration: 'Citabria',
    type: 'American Champion 7ECA Citabria',
    engine: 'Lycoming O-235',
    horsepower: '118 HP',
    cruiseSpeed: '95 KTAS',
    seats: '2 (tandem)',
    mission: [
      'Tailwheel endorsement',
      'Stick-and-rudder refresher',
      'Spin training',
      'Light aerobatic introduction',
    ],
    features: [
      'Conventional gear (taildragger)',
      'Fabric-covered, tube-and-fabric',
      'Tandem seating — you fly from the front',
      '+5 / -2 G limits',
    ],
    rate: 'Contact for rates',
    category: 'Tailwheel Trainer',
    description: 'A legendary tailwheel trainer that will make you a better pilot in any airplane. The 7ECA is responsive, honest, and the perfect platform for mastering conventional gear, coordinated flight, and spin recovery. If you want to feel what the airplane is actually doing, this is the one.',
    color: 'bg-[#FDF5E6] border-[#ECD9A8]',
  },
  {
    id: 'decathlon-8kcab',
    registration: 'Decathlon',
    type: 'American Champion 8KCAB Decathlon',
    engine: 'Lycoming AEIO-360',
    horsepower: '180 HP',
    cruiseSpeed: '105 KTAS',
    seats: '2 (tandem)',
    mission: [
      'Emergency Maneuver Training (EMT)',
      'Spin endorsement for CFI applicants',
      'Basic aerobatics',
      'Unusual attitude recovery',
    ],
    features: [
      'Inverted fuel & oil systems',
      'Symmetrical airfoil',
      '+6 / -5 G certified',
      'Constant-chord wing for honest handling',
    ],
    rate: 'Contact for rates',
    category: 'Aerobatic Aircraft',
    description: 'The Decathlon is purpose-built for aerobatics and upset training. Inverted fuel and oil systems, symmetrical wing, +6/-5 G limits — it will do everything you ask of it. This is the airplane behind our Emergency Maneuver Training program and the Vicki Cruse Memorial Scholarship. Come take a "spin" with us in our waivered aerobatic practice area, just a few miles off the end of the runway.',
    color: 'bg-[#FBE9EC] border-[#EFC3CA]',
  },
]

function AircraftIcon({ category }: { category: string }) {
  if (category.includes('Aerobatic')) {
    return (
      <svg viewBox="0 0 80 80" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="40" cy="40" rx="4" ry="26" fill="#C8102E" fillOpacity="0.18" stroke="#C8102E" strokeWidth="2" />
        <path d="M40 36 L10 48 L16 48 L40 42 L64 48 L70 48 Z" fill="#C8102E" fillOpacity="0.22" stroke="#C8102E" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M40 58 L26 66 L30 66 L40 62 L50 66 L54 66 Z" fill="#C8102E" fillOpacity="0.18" stroke="#C8102E" strokeWidth="1.5" strokeLinejoin="round" />
        <ellipse cx="40" cy="16" rx="3" ry="5" fill="#C8102E" fillOpacity="0.32" stroke="#C8102E" strokeWidth="1.5" />
        <ellipse cx="40" cy="13" rx="8" ry="1.5" fill="#0B2545" fillOpacity="0.5" />
        <path d="M18 72 Q40 52 62 72" stroke="#E8A93E" strokeWidth="1.5" fill="none" strokeDasharray="2 3" opacity="0.7" />
      </svg>
    )
  }
  if (category.includes('Tailwheel')) {
    return (
      <svg viewBox="0 0 80 80" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 44 L22 38 L50 36 L66 40 L68 44 L64 46 L28 48 L10 47 Z" fill="#E8A93E" fillOpacity="0.28" stroke="#0B2545" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M54 36 L62 24 L66 24 L66 40" stroke="#0B2545" strokeWidth="1.5" fill="#E8A93E" fillOpacity="0.2" />
        <path d="M22 38 L22 30 L34 30 L34 36" stroke="#0B2545" strokeWidth="1.5" fill="#FBF9F4" />
        <circle cx="24" cy="52" r="3" fill="#0B2545" />
        <circle cx="58" cy="48" r="2" fill="#0B2545" />
        <line x1="8" y1="44" x2="2" y2="42" stroke="#0B2545" strokeWidth="1.2" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="40" rx="5" ry="28" fill="#0B2545" fillOpacity="0.12" stroke="#0B2545" strokeWidth="2" />
      <path d="M40 34 L6 44 L12 44 L40 40 L68 44 L74 44 Z" fill="#0B2545" fillOpacity="0.18" stroke="#0B2545" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M40 60 L24 68 L28 68 L40 64 L52 68 L56 68 Z" fill="#0B2545" fillOpacity="0.15" stroke="#0B2545" strokeWidth="1.5" strokeLinejoin="round" />
      <ellipse cx="40" cy="15" rx="3" ry="5" fill="#C8102E" fillOpacity="0.4" stroke="#C8102E" strokeWidth="1.5" />
      <ellipse cx="40" cy="12" rx="8" ry="1.5" fill="#0B2545" fillOpacity="0.55" />
    </svg>
  )
}

export default function FleetPage() {
  return (
    <>
      <Head>
        <title>Fleet | CP Aviation — Santa Paula Airport (KSZP)</title>
        <meta name="description" content="CP Aviation's training fleet at Santa Paula Airport: Cessna 172 Skyhawks, American Champion Citabrias, and Decathlons. Maintained in-house since 1987." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="antialiased selection:bg-cpRed selection:text-white font-sans">
        <Navigation siteSettings={siteSettings} />

        {/* Hero */}
        <header className="relative min-h-[35vh] flex flex-col justify-end pb-12 pt-32 bg-cpLight border-b border-gray-200 overflow-hidden">
          <div className="absolute inset-0 flex justify-center opacity-30 pointer-events-none">
            <div className="w-[2px] h-full runway-centerline" />
          </div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 z-10 w-full">
            <div className="inline-flex items-center sign-loc px-2 py-0.5 mb-4">
              <span className="font-mono text-sm font-bold">KSZP FLEET</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-sans text-cpDark tracking-tight mb-4">
              The Aircraft.
            </h1>
            <p className="text-gray-600 font-light text-base sm:text-lg max-w-2xl leading-relaxed">
              From first solo in a Cessna to spins in the Decathlon — every aircraft at CP Aviation is maintained by our own shop at Santa Paula Airport and dispatched only when airworthy. No excuses, no compromises.
            </p>
          </div>
        </header>

        {/* Fleet grid */}
        <section className="py-16 sm:py-24 bg-cpPaper">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Stats bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16 p-4 sm:p-6 bg-cpLight border border-gray-100 rounded">
              <div className="text-center">
                <div className="text-2xl font-bold font-mono text-cpRed">3</div>
                <div className="text-xs tracking-widest text-gray-500 font-mono">AIRCRAFT TYPES</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold font-mono text-cpRed">1987</div>
                <div className="text-xs tracking-widest text-gray-500 font-mono">FOUNDED</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold font-mono text-cpRed">KSZP</div>
                <div className="text-xs tracking-widest text-gray-500 font-mono">SANTA PAULA</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold font-mono text-cpRed">IN-HOUSE</div>
                <div className="text-xs tracking-widest text-gray-500 font-mono">MAINTENANCE</div>
              </div>
            </div>

            <div className="space-y-8">
              {fleet.map((ac) => (
                <div key={ac.id} className={`border rounded overflow-hidden ${ac.color}`}>
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-56 xl:w-64 flex-shrink-0 flex items-center justify-center p-6 sm:p-8 bg-cpPaper bg-opacity-70">
                      <div className="w-32 h-32 sm:w-40 sm:h-40">
                        <AircraftIcon category={ac.category} />
                      </div>
                    </div>

                    <div className="flex-1 p-5 sm:p-8">
                      <div className="flex flex-wrap items-start gap-3 mb-3">
                        <span className="font-mono text-xs bg-cpDark text-white px-2 py-0.5 rounded-sm tracking-widest">{ac.category}</span>
                        <span className="font-mono text-xs text-cpRed tracking-widest">{ac.rate}</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold font-sans text-cpDark mb-1">{ac.type}</h2>
                      <div className="text-xs font-mono text-gray-500 mb-4 tracking-widest">{ac.engine} · {ac.horsepower}</div>
                      <p className="text-gray-700 font-light text-sm leading-relaxed mb-6">{ac.description}</p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                        {[
                          { label: 'Cruise', value: ac.cruiseSpeed },
                          { label: 'Seats', value: ac.seats },
                          { label: 'Fleet', value: ac.registration },
                        ].map(spec => (
                          <div key={spec.label} className="bg-cpPaper bg-opacity-80 border border-white rounded px-3 py-2">
                            <div className="text-xs font-mono text-gray-500 tracking-widest">{spec.label}</div>
                            <div className="text-sm font-mono font-semibold text-cpDark">{spec.value}</div>
                          </div>
                        ))}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <div className="text-[10px] font-mono text-gray-500 tracking-widest mb-2 uppercase">Training Mission</div>
                          <ul className="space-y-1">
                            {ac.mission.map((a, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                                <span className="text-cpRed mt-0.5 shrink-0">›</span>
                                {a}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="text-[10px] font-mono text-gray-500 tracking-widest mb-2 uppercase">Features</div>
                          <ul className="space-y-1">
                            {ac.features.map((f, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                                <span className="text-cpRed mt-0.5 shrink-0">›</span>
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Maintenance callout */}
            <div className="mt-12 p-6 sm:p-8 border border-cpGold bg-cpLight rounded">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1">
                  <div className="text-xs font-mono text-cpGold tracking-widest mb-2">ON-FIELD MAINTENANCE</div>
                  <h3 className="text-xl sm:text-2xl font-bold font-sans text-cpDark mb-3">The Same People Who Fly Them, Fix Them.</h3>
                  <p className="text-gray-700 font-light text-sm leading-relaxed">
                    Our maintenance shop specializes in all models of Cessna, Citabrias and Decathlons. We&apos;ll get you going. In-house mechanics who know these aircraft inside and out — because we fly them too.
                  </p>
                </div>
              </div>
            </div>

            {/* Reservation CTA */}
            <div className="mt-10 p-6 sm:p-10 bg-cpDark text-white text-center rounded">
              <h3 className="text-2xl sm:text-3xl font-bold font-sans mb-3">Ready to Fly?</h3>
              <p className="text-gray-200 font-light mb-6 max-w-lg mx-auto text-sm">Call or email to book your discovery flight, schedule a checkout, or ask about availability. We&apos;re based at Santa Paula Airport (KSZP).</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href={`mailto:${siteSettings.contactEmail}`}
                  className="font-mono text-xs font-semibold border border-cpRed bg-cpRed text-white px-6 py-3 hover:bg-red-800 transition-colors rounded-sm tracking-wider"
                >
                  CONTACT US
                </a>
                <Link
                  href="/pricing"
                  className="font-mono text-xs font-semibold border border-cpGold text-cpGold px-6 py-3 hover:bg-cpGold hover:text-cpDark transition-colors rounded-sm tracking-wider"
                >
                  VIEW PRICING
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer footer={footer} siteSettings={siteSettings} />
      </div>
    </>
  )
}
