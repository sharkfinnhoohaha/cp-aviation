import Head from 'next/head'
import Link from 'next/link'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

const siteSettings = {
  companyName: 'Camarillo Flight Instruction',
  logoText: 'CFI',
  contactEmail: 'info@camarilloflightinstruction.com',
  phone: '805-233-7601',
  location: 'CAMARILLO AIRPORT, CA (KCMA)',
  copyrightYear: '2026',
}

const footer = { ctaText: 'Cleared for Takeoff.', runwayNumber: '26' }

interface Aircraft {
  id: string
  registration: string
  type: string
  year: string
  engine: string
  horsepower: string
  cruiseSpeed: string
  range: string
  ceiling: string
  seats: string
  avionics: string[]
  features: string[]
  wetRate: string
  category: string
  description: string
  color: string
}

const fleet: Aircraft[] = [
  {
    id: 'c172-1',
    registration: 'N-KCMA',
    type: 'Cessna 172S Skyhawk SP',
    year: '2008',
    engine: 'Lycoming IO-360-L2A',
    horsepower: '180 HP',
    cruiseSpeed: '122 KTAS',
    range: '640 nm',
    ceiling: '14,000 ft',
    seats: '4',
    avionics: ['Garmin G1000 NXi Glass Cockpit', 'GFC 700 Autopilot', 'ADS-B In/Out', 'XM Weather'],
    features: ['Fuel-injected engine', 'Composite propeller', 'Air conditioning capable', 'Excellent crosswind capability'],
    wetRate: '$175/hr',
    category: 'Primary Trainer',
    description: 'The Cessna 172S is the world\'s most popular training aircraft — and for good reason. Our Skyhawk SP variant features the upgraded 180 HP fuel-injected engine and Garmin G1000 NXi glass panel, giving student pilots experience on the same avionics suite used in modern commercial aircraft. Forgiving handling, excellent visibility, and rock-solid stability make this the ideal platform for earning your Private Pilot Certificate.',
    color: 'bg-blue-50 border-blue-100',
  },
  {
    id: 'c172-2',
    registration: 'N-KCMA2',
    type: 'Cessna 172R Skyhawk',
    year: '2001',
    engine: 'Lycoming IO-360-L2A',
    horsepower: '160 HP',
    cruiseSpeed: '118 KTAS',
    range: '580 nm',
    ceiling: '14,000 ft',
    seats: '4',
    avionics: ['Garmin G430W GPS/NAV/COM', 'Garmin GTX 345 ADS-B', 'GI 275 Electronic HSI', 'S-TEC 55X Autopilot'],
    features: ['Steam gauges with glass supplement', 'Strong crosswind gear', 'Reliable training platform', 'VFR/IFR capable'],
    wetRate: '$160/hr',
    category: 'Primary / IFR Trainer',
    description: 'Our second Skyhawk is equipped with a combination of traditional steam gauges and modern Garmin avionics — ideal for students learning to transition between old-school and glass cockpit flying. The S-TEC 55X autopilot makes this aircraft IFR-capable for instrument students.',
    color: 'bg-gray-50 border-gray-100',
  },
  {
    id: 'piper-archer',
    registration: 'N-ARCH',
    type: 'Piper PA-28-181 Archer III',
    year: '2005',
    engine: 'Lycoming O-360-A4M',
    horsepower: '180 HP',
    cruiseSpeed: '125 KTAS',
    range: '520 nm',
    ceiling: '14,100 ft',
    seats: '4',
    avionics: ['Garmin G500 TXi', 'Garmin GNS 430W', 'Garmin GTX 345 ADS-B In/Out', 'King KAP 140 Autopilot'],
    features: ['Low-wing configuration', 'Excellent cross-country platform', 'Wider cockpit than C172', 'Trailing link landing gear'],
    wetRate: '$170/hr',
    category: 'Cross-Country / IFR',
    description: 'The Piper Archer III is a low-wing touring aircraft that many pilots prefer for cross-country flights. Its wider cockpit, excellent range, and smooth handling characteristics at cruise altitudes make it a popular choice for instrument rating students and pilots who want more passenger comfort. The low wing also gives better visibility in turns.',
    color: 'bg-red-50 border-red-100',
  },
  {
    id: 'piper-warrior',
    registration: 'N-WAR',
    type: 'Piper PA-28-161 Warrior III',
    year: '1999',
    engine: 'Lycoming O-320-D3G',
    horsepower: '160 HP',
    cruiseSpeed: '110 KTAS',
    range: '465 nm',
    ceiling: '11,000 ft',
    seats: '4',
    avionics: ['Garmin G5 EFIS (x2)', 'Garmin GTN 650', 'Garmin GTX 335 ADS-B Out', 'KX-155 NAV/COM backup'],
    features: ['Economical wet rate', 'Low-wing for improved visibility', 'Great for pattern work', 'Easy on fuel'],
    wetRate: '$148/hr',
    category: 'Primary Trainer',
    description: 'The Warrior III is our most economical training aircraft — ideal for students on a budget who still want to log quality hours. Don\'t let the lower horsepower fool you: the Warrior handles beautifully in the pattern at KCMA and builds excellent stick-and-rudder skills. Its light control forces give a pilot real "feel" for what the airplane is doing.',
    color: 'bg-yellow-50 border-yellow-100',
  },
  {
    id: 'diamond-da40',
    registration: 'N-DA40',
    type: 'Diamond DA40-G1000 Diamond Star',
    year: '2006',
    engine: 'Lycoming IO-360-M1A',
    horsepower: '180 HP',
    cruiseSpeed: '138 KTAS',
    range: '720 nm',
    ceiling: '16,400 ft',
    seats: '4',
    avionics: ['Garmin G1000 NXi', 'GFC 700 Autopilot', 'ADS-B In/Out', 'GDL 51 SiriusXM'],
    features: ['Carbon fiber composite airframe', 'T-tail design', 'Excellent fuel economy', 'Canopy instead of doors'],
    wetRate: '$185/hr',
    category: 'Advanced / Cross-Country',
    description: 'The Diamond DA40 is the most sophisticated aircraft in our fleet. Its composite airframe is lighter and stronger than aluminum, giving it outstanding performance numbers. The G1000 NXi and GFC 700 autopilot make this aircraft capable of flying precision approaches in IMC. With a 720 nm range, students can fly from KCMA to Las Vegas, Phoenix, or the Bay Area non-stop. This is the aircraft many students aspire to fly.',
    color: 'bg-green-50 border-green-100',
  },
  {
    id: 'elite-sim',
    registration: 'SIM-1',
    type: 'Elite Advanced Aviation Simulator',
    year: '2018',
    engine: 'Full-Motion Platform',
    horsepower: '—',
    cruiseSpeed: 'Cessna 172 / IFR Procedures',
    range: 'Unlimited',
    ceiling: 'Any altitude',
    seats: '2',
    avionics: ['Garmin G1000 replica panel', 'FAA-approved for IFR training', 'Weather simulation', 'Failure scenarios'],
    features: ['FAA-approved AATD', 'Logable IFR time', 'Full ILS/GPS approach training', 'Emergency procedure practice'],
    wetRate: '$65/hr',
    category: 'Simulator (AATD)',
    description: 'Our Elite Advanced Aviation Training Device (AATD) is FAA-approved for instrument currency, IPC (Instrument Proficiency Check) training, and logging up to 20 hours toward the instrument rating. Use it to practice approaches, holds, partial-panel flying, and instrument failures without burning avgas. At $65/hr with a CFI, it\'s the most cost-effective way to build instrument skills — including in actual IMC weather conditions.',
    color: 'bg-purple-50 border-purple-100',
  },
]

function AircraftIcon({ category }: { category: string }) {
  if (category.includes('Simulator')) {
    return (
      <svg viewBox="0 0 80 80" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="20" width="60" height="40" rx="4" stroke="#DC2626" strokeWidth="2.5" fill="white" fillOpacity="0.6" />
        <rect x="16" y="26" width="48" height="26" rx="2" fill="#111827" fillOpacity="0.08" stroke="#9CA3AF" strokeWidth="1" />
        <circle cx="22" cy="39" r="7" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
        <line x1="22" y1="32" x2="22" y2="46" stroke="#9CA3AF" strokeWidth="1" />
        <line x1="15" y1="39" x2="29" y2="39" stroke="#9CA3AF" strokeWidth="1" />
        <line x1="22" y1="39" x2="26" y2="35" stroke="#DC2626" strokeWidth="1.5" />
        <rect x="34" y="30" width="25" height="4" rx="1" fill="#DC2626" fillOpacity="0.3" />
        <rect x="34" y="37" width="18" height="3" rx="1" fill="#9CA3AF" fillOpacity="0.5" />
        <rect x="34" y="43" width="22" height="3" rx="1" fill="#9CA3AF" fillOpacity="0.5" />
        <rect x="20" y="60" width="40" height="4" rx="2" fill="#9CA3AF" fillOpacity="0.3" />
        <rect x="28" y="64" width="24" height="8" rx="1" fill="#9CA3AF" fillOpacity="0.2" />
      </svg>
    )
  }
  // Generic airplane top-view silhouette
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Fuselage */}
      <ellipse cx="40" cy="40" rx="5" ry="28" fill="#DC2626" fillOpacity="0.15" stroke="#DC2626" strokeWidth="2" />
      {/* Wings */}
      <path d="M40 36 L8 52 L14 52 L40 42 L66 52 L72 52 Z" fill="#DC2626" fillOpacity="0.2" stroke="#DC2626" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Horizontal stabilizer */}
      <path d="M40 60 L24 68 L28 68 L40 64 L52 68 L56 68 Z" fill="#DC2626" fillOpacity="0.15" stroke="#DC2626" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Nose */}
      <ellipse cx="40" cy="15" rx="3" ry="5" fill="#DC2626" fillOpacity="0.3" stroke="#DC2626" strokeWidth="1.5" />
      {/* Propeller */}
      <ellipse cx="40" cy="12" rx="8" ry="1.5" fill="#111827" fillOpacity="0.4" />
    </svg>
  )
}

export default function FleetPage() {
  return (
    <>
      <Head>
        <title>Fleet | Camarillo Flight Instruction</title>
        <meta name="description" content="Cessna, Piper, and Diamond aircraft plus an Elite simulator — our dispatch-ready fleet at KCMA." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="antialiased selection:bg-jacRed selection:text-white font-sans">
        <Navigation siteSettings={siteSettings} />

        {/* Hero */}
        <header className="relative min-h-[35vh] flex flex-col justify-end pb-12 pt-32 bg-jacLight border-b border-gray-200 overflow-hidden">
          <div className="absolute inset-0 flex justify-center opacity-30 pointer-events-none">
            <div className="w-[2px] h-full runway-centerline" />
          </div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 z-10 w-full">
            <div className="inline-flex items-center sign-loc px-2 py-0.5 mb-4">
              <span className="font-mono text-sm font-bold">KCMA FLEET</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-sans text-jacDark tracking-tight mb-4">
              The Aircraft.
            </h1>
            <p className="text-gray-500 font-light text-base sm:text-lg max-w-2xl leading-relaxed">
              Every aircraft in our fleet is hangared on the field at Camarillo Airport, maintained above minimum requirements, and dispatched only when airworthy. No excuses, no compromises.
            </p>
          </div>
        </header>

        {/* Fleet grid */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Stats bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16 p-4 sm:p-6 bg-jacLight border border-gray-100 rounded">
              <div className="text-center">
                <div className="text-2xl font-bold font-mono text-jacRed">6</div>
                <div className="text-xs tracking-widest text-gray-500 font-mono">AIRCRAFT + SIM</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold font-mono text-jacRed">2009</div>
                <div className="text-xs tracking-widest text-gray-500 font-mono">FOUNDED</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold font-mono text-jacRed">100%</div>
                <div className="text-xs tracking-widest text-gray-500 font-mono">HANGARED</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold font-mono text-jacRed">24/7</div>
                <div className="text-xs tracking-widest text-gray-500 font-mono">SCHEDULING</div>
              </div>
            </div>

            <div className="space-y-8">
              {fleet.map((ac) => (
                <div key={ac.id} className={`border rounded overflow-hidden ${ac.color}`}>
                  <div className="flex flex-col lg:flex-row">
                    {/* Illustration */}
                    <div className="lg:w-56 xl:w-64 flex-shrink-0 flex items-center justify-center p-6 sm:p-8 bg-white bg-opacity-60">
                      <div className="w-32 h-32 sm:w-40 sm:h-40">
                        <AircraftIcon category={ac.category} />
                      </div>
                    </div>

                    {/* Main info */}
                    <div className="flex-1 p-5 sm:p-8">
                      <div className="flex flex-wrap items-start gap-3 mb-3">
                        <span className="font-mono text-xs bg-jacDark text-white px-2 py-0.5 rounded-sm tracking-widest">{ac.category}</span>
                        <span className="font-mono text-xs text-jacRed tracking-widest">{ac.wetRate} wet</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold font-sans text-jacDark mb-1">{ac.type}</h2>
                      <div className="text-xs font-mono text-gray-400 mb-4 tracking-widest">{ac.year} · {ac.engine} · {ac.horsepower}</div>
                      <p className="text-gray-600 font-light text-sm leading-relaxed mb-6">{ac.description}</p>

                      {/* Specs grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        {[
                          { label: 'Cruise', value: ac.cruiseSpeed },
                          { label: 'Range', value: ac.range },
                          { label: 'Ceiling', value: ac.ceiling },
                          { label: 'Seats', value: ac.seats },
                        ].map(spec => (
                          <div key={spec.label} className="bg-white bg-opacity-70 border border-white rounded px-3 py-2">
                            <div className="text-xs font-mono text-gray-400 tracking-widest">{spec.label}</div>
                            <div className="text-sm font-mono font-semibold text-jacDark">{spec.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Avionics + Features */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <div className="text-[10px] font-mono text-gray-400 tracking-widest mb-2 uppercase">Avionics</div>
                          <ul className="space-y-1">
                            {ac.avionics.map((a, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                <span className="text-jacRed mt-0.5 shrink-0">›</span>
                                {a}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="text-[10px] font-mono text-gray-400 tracking-widest mb-2 uppercase">Features</div>
                          <ul className="space-y-1">
                            {ac.features.map((f, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                <span className="text-jacRed mt-0.5 shrink-0">›</span>
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

            {/* Reservation CTA */}
            <div className="mt-16 p-6 sm:p-10 bg-jacDark text-white text-center rounded">
              <h3 className="text-2xl sm:text-3xl font-bold font-sans mb-3">Ready to Book?</h3>
              <p className="text-gray-300 font-light mb-6 max-w-lg mx-auto text-sm">Flight Club 805 members get priority scheduling and discounted wet rates on every aircraft. Non-member rentals available with instructor endorsement.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="mailto:info@camarilloflightinstruction.com"
                  className="font-mono text-xs font-semibold border border-jacRed text-white px-6 py-3 hover:bg-jacRed transition-colors rounded-sm tracking-wider"
                >
                  CONTACT US
                </a>
                <Link
                  href="/pricing"
                  className="font-mono text-xs font-semibold border border-gray-500 text-gray-300 px-6 py-3 hover:border-white hover:text-white transition-colors rounded-sm tracking-wider"
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
