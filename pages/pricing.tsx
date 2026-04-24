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

const aircraftRates = [
  { aircraft: 'Cessna 172 Skyhawk', engine: 'Lycoming', category: 'Primary / IFR Trainer' },
  { aircraft: 'American Champion 7ECA Citabria', engine: 'Lycoming O-235 · 118 HP', category: 'Tailwheel Trainer' },
  { aircraft: 'American Champion 8KCAB Decathlon', engine: 'Lycoming AEIO-360 · 180 HP', category: 'Aerobatic / EMT' },
]

const instructorRates = [
  { label: 'Discovery (Introductory) Flight', note: 'A hands-on intro flight — fly the airplane yourself. No experience required.' },
  { label: 'Flight Instruction (CFI / CFII)', note: 'Private, Instrument, Commercial, CFI, CFII, MEI support.' },
  { label: 'Tailwheel Training & Endorsements', note: 'Citabria-based. First-time tailwheel through advanced handling.' },
  { label: 'Emergency Maneuver Training (EMT)', note: 'Spin, unusual attitude and basic aerobatic program in the Decathlon.' },
  { label: 'Flight Review / IPC', note: 'FAR 61.56 reviews and instrument proficiency checks.' },
  { label: 'Ground Instruction', note: 'Written test prep, oral prep, weather briefings, cross-country planning.' },
]

const trainingPrograms = [
  {
    name: 'Private Pilot Certificate',
    hours: 'FAA minimum 40 hrs · national average 60–70 hrs',
    bullets: [
      'One-on-one CFI instruction, paced to you',
      'Cessna 172 Skyhawk primary trainer',
      'Full ground school support & written test prep',
      'Checkride prep with a dedicated CFI',
    ],
    note: 'Your first license. Start with a Discovery Flight and build from there — we quote a training package estimate once we know your schedule and starting point.',
  },
  {
    name: 'Instrument Rating',
    hours: '50 hrs instrument time required',
    bullets: [
      'IFR-capable Cessna platform',
      'Experienced CFII instructors',
      'Southern California complex airspace — LA Class B, SoCal TRACON',
      'Real IMC experience when weather allows',
    ],
    note: 'Turn weather from a showstopper into a strategy. Fly with confidence in the soup.',
  },
  {
    name: 'Commercial & CFI',
    hours: '250 total time for Commercial',
    bullets: [
      'Commercial single-engine training',
      'CFI initial + CFII add-on',
      'Spin endorsement in the Decathlon (required for CFI)',
      'Same instructors from solo through sign-off',
    ],
    note: 'Career-grade training from a school celebrating 30+ years of Training Safe Pilots.',
  },
  {
    name: 'Emergency Maneuver Training (EMT)',
    hours: 'Typically 3–5 hrs over several days',
    bullets: [
      'Spin entries, recoveries and incipient spins',
      'Unusual attitude recovery',
      'Basic aerobatic introduction',
      'Developed by Rich Stowell, flown in our Decathlon',
    ],
    note: 'A confidence-builder that every pilot benefits from — and a required step for CFI applicants.',
  },
  {
    name: 'Tailwheel Training',
    hours: 'Varies — first endorsements typically 8–12 hrs',
    bullets: [
      'American Champion 7ECA Citabria',
      'Conventional-gear fundamentals',
      'Crosswind handling, three-point & wheel landings',
      'Endorsement per 14 CFR 61.31(i)',
    ],
    note: 'Master stick-and-rudder skills that make you a better pilot in any airplane.',
  },
]

const faqItems = [
  {
    q: 'How are rates structured?',
    a: 'Aircraft time is billed by the Hobbs hour and instructor time is billed separately. Current published rates are available on request — call or email and we\'ll send you the current rate sheet.',
  },
  {
    q: 'Do I need a medical to start training?',
    a: 'For instruction, no medical is required — you\'re not acting as PIC. For solo flight you\'ll need a Third-Class Medical or BasicMed, which we can help you arrange. For a Discovery Flight, no medical is needed.',
  },
  {
    q: 'What is a Discovery Flight?',
    a: 'Our Introductory (Discovery) Flight is a hands-on experience where you\'ll actually fly the airplane with a CFI next to you. Most Discovery Flights run about an hour. It\'s the best way to find out if flying is for you.',
  },
  {
    q: 'How long does Private Pilot training take?',
    a: 'The FAA minimum is 40 hours, but the national average is closer to 65–70 hours. Calendar time depends entirely on how often you fly — students who fly 2–3 times per week finish in months, not years.',
  },
  {
    q: 'What is the Vicki Cruse Memorial Scholarship?',
    a: 'An annual scholarship, started in 2005, awarded each summer to an IAC member who holds a pilot certificate and wants to pursue spin, unusual attitude and basic aerobatic training. Given in memory of Santa Paula aerobatic champion Vicki Cruse.',
  },
  {
    q: 'Does CP Aviation service my airplane?',
    a: 'Yes — our in-house maintenance shop specializes in all models of Cessna, Citabrias and Decathlons. We\'ll get you going.',
  },
]

export default function PricingPage() {
  return (
    <>
      <Head>
        <title>Training & Rates | CP Aviation — Santa Paula (KSZP)</title>
        <meta name="description" content="Training programs, instruction rates, and package details at CP Aviation. Private, Instrument, Commercial, CFI, tailwheel, and Emergency Maneuver Training at Santa Paula Airport." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Training & Rates | CP Aviation — Santa Paula (KSZP)" />
        <meta property="og:description" content="Private, Instrument, Commercial, CFI, tailwheel, and EMT training at Santa Paula Airport. Training Safe Pilots since 1987." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.jpg" />
      </Head>
      <div className="antialiased selection:bg-cpRed selection:text-white font-sans">
        <Navigation siteSettings={siteSettings} />

        {/* Hero */}
        <header className="relative min-h-[30vh] flex flex-col justify-end pb-12 pt-32 bg-cpLight border-b border-gray-200 overflow-hidden">
          <div className="absolute inset-0 flex justify-center opacity-30 pointer-events-none">
            <div className="w-[2px] h-full runway-centerline" />
          </div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 z-10 w-full">
            <div className="inline-flex items-center sign-loc px-2 py-0.5 mb-4">
              <span className="font-mono text-sm font-bold">TRAINING & RATES</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-sans text-cpDark tracking-tight mb-4">
              Programs.
            </h1>
            <p className="text-gray-600 font-light text-base sm:text-lg max-w-2xl leading-relaxed">
              From Discovery Flights to CFI sign-offs — one-on-one instruction at Santa Paula Airport (KSZP). Call for the current rate sheet and we&apos;ll put together a plan that fits your schedule.
            </p>
          </div>
        </header>

        {/* Rate sheet callout */}
        <section className="py-10 bg-cpDark">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-xs font-mono text-cpGold tracking-widest mb-2">CURRENT RATE SHEET</div>
              <h2 className="text-xl sm:text-2xl font-bold font-sans text-white">Contact us for published aircraft and instruction rates.</h2>
              <p className="text-gray-300 text-sm mt-2 font-light max-w-2xl">Our rate sheet is updated regularly. Email or call and we&apos;ll send you the latest pricing along with a training package estimate tailored to you.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href={`mailto:${siteSettings.contactEmail}`}
                className="font-mono text-xs font-semibold bg-cpRed text-white px-6 py-3 hover:bg-red-800 transition-colors rounded-sm tracking-wider text-center"
              >
                EMAIL FOR RATES
              </a>
              <a
                href={`tel:${siteSettings.phone.replace(/\D/g, '')}`}
                className="font-mono text-xs font-semibold border border-cpGold text-cpGold px-6 py-3 hover:bg-cpGold hover:text-cpDark transition-colors rounded-sm tracking-wider text-center"
              >
                {siteSettings.phone}
              </a>
            </div>
          </div>
        </section>

        {/* Aircraft */}
        <section className="py-16 sm:py-20 bg-cpPaper border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-cpDark mb-2">Training Fleet</h2>
            <p className="text-gray-600 font-light text-sm mb-8">
              Our fleet is sized to match the training — Cessnas for primary and IFR, a Citabria for tailwheel, a Decathlon for spins and aerobatics.
            </p>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-mono text-[10px] tracking-widest text-gray-500 uppercase">Aircraft</th>
                    <th className="text-left py-3 px-4 font-mono text-[10px] tracking-widest text-gray-500 uppercase hidden sm:table-cell">Powerplant</th>
                    <th className="text-left py-3 px-4 font-mono text-[10px] tracking-widest text-cpRed uppercase">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {aircraftRates.map((r, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-cpLight transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-semibold text-cpDark">{r.aircraft}</div>
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-600 hidden sm:table-cell font-mono">{r.engine}</td>
                      <td className="py-4 px-4 text-xs text-cpDark">{r.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-4 italic">Published rates available on request. Aircraft billed by Hobbs time; instruction billed separately.</p>
          </div>
        </section>

        {/* Instruction */}
        <section className="py-16 sm:py-20 bg-cpLight border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-cpDark mb-2">Instruction</h2>
            <p className="text-gray-600 font-light text-sm mb-8">Every flight is one-on-one. No pooled classes, no shuffle between CFIs — the same instructor who helps you solo can sign you off to teach.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {instructorRates.map((r, i) => (
                <div key={i} className="p-5 bg-cpPaper border border-gray-100 rounded">
                  <div className="font-semibold text-cpDark text-sm mb-1">{r.label}</div>
                  <div className="text-xs text-gray-600 leading-relaxed">{r.note}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Programs */}
        <section className="py-16 sm:py-24 bg-cpPaper border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-cpDark mb-2">Programs</h2>
            <p className="text-gray-600 font-light text-sm mb-10">
              Training Safe Pilots since 1987. Whether you want your first license or your last endorsement, we have a track for you.
            </p>
            <div className="space-y-6">
              {trainingPrograms.map((pkg) => (
                <div key={pkg.name} className="bg-white border border-gray-100 rounded overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 sm:px-8 py-5 border-b border-gray-50 bg-cpLight">
                    <div>
                      <h3 className="text-lg font-bold font-sans text-cpDark">{pkg.name}</h3>
                      <div className="text-xs font-mono text-gray-500 tracking-widest mt-0.5">{pkg.hours}</div>
                    </div>
                  </div>
                  <div className="px-5 sm:px-8 py-5">
                    <ul className="space-y-2 mb-4">
                      {pkg.bullets.map((line, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-cpRed mt-0.5 shrink-0 font-bold">›</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-gray-500 border-t border-gray-50 pt-4 leading-relaxed">{pkg.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Scholarship */}
        <section className="py-16 sm:py-20 bg-cpLight border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center sign-loc px-2 py-0.5 mb-4">
              <span className="font-mono text-sm font-bold">SCHOLARSHIP</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-cpDark mb-3">Vicki Cruse Memorial Scholarship</h2>
            <p className="text-gray-700 font-light text-sm sm:text-base leading-relaxed">
              Started in 2005 and awarded each summer to an IAC member who holds a pilot certificate and wishes to pursue spin, unusual attitude and basic aerobatic training. Given in memory of Santa Paula aerobatic champion Vicki Cruse — member of the United States Unlimited Aerobatic Team and president of the International Aerobatic Club.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 sm:py-24 bg-cpPaper border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-cpDark mb-10">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqItems.map((faq, i) => (
                <div key={i} className="border-b border-gray-100 pb-6">
                  <h3 className="font-bold text-cpDark mb-2">{faq.q}</h3>
                  <p className="text-gray-700 font-light text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20 bg-cpDark text-white text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans mb-4">Stop Wondering. Start Flying.</h2>
            <p className="text-gray-300 font-light text-sm mb-8 leading-relaxed">
              Book a Discovery Flight and take the controls yourself. Call {siteSettings.phone} or email us to schedule.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={`mailto:${siteSettings.contactEmail}`}
                className="font-mono text-xs font-semibold bg-cpRed text-white px-8 py-3 hover:bg-red-800 transition-colors rounded-sm tracking-wider"
              >
                SCHEDULE A DISCOVERY FLIGHT
              </a>
              <Link
                href="/fleet"
                className="font-mono text-xs font-semibold border border-cpGold text-cpGold px-8 py-3 hover:bg-cpGold hover:text-cpDark transition-colors rounded-sm tracking-wider"
              >
                VIEW THE FLEET
              </Link>
            </div>
          </div>
        </section>

        <Footer footer={footer} siteSettings={siteSettings} />
      </div>
    </>
  )
}
