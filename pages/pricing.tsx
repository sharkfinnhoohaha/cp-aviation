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

const aircraftRates = [
  { aircraft: 'Piper Warrior III', year: '1999', hp: '160 HP', nonMember: '$148', member: '$138', category: 'Primary Trainer' },
  { aircraft: 'Cessna 172R Skyhawk', year: '2001', hp: '160 HP', nonMember: '$160', member: '$149', category: 'Primary / IFR' },
  { aircraft: 'Piper Archer III', year: '2005', hp: '180 HP', nonMember: '$170', member: '$158', category: 'Cross-Country / IFR' },
  { aircraft: 'Cessna 172S Skyhawk SP', year: '2008', hp: '180 HP', nonMember: '$175', member: '$163', category: 'Primary Trainer / G1000' },
  { aircraft: 'Diamond DA40', year: '2006', hp: '180 HP', nonMember: '$185', member: '$172', category: 'Advanced / Cross-Country' },
  { aircraft: 'Elite AATD Simulator', year: '2018', hp: 'FAA AATD', nonMember: '$65', member: '$58', category: 'Simulator' },
]

const instructorRates = [
  { label: 'Flight Instruction (CFI/CFII)', rate: '$55/hr', note: 'All certificates and ratings' },
  { label: 'Ground Instruction', rate: '$55/hr', note: 'Pre/post-flight briefings, written test prep' },
  { label: 'FAA Written Test Prep', rate: '$55/hr', note: 'Jeppesen or ASA material provided' },
  { label: 'Instrument Proficiency Check (IPC)', rate: '$55/hr + sim', note: 'With CFII, includes sim time' },
  { label: 'Flight Review (BFR)', rate: '$55/hr', note: 'Per FAR 61.56 requirements' },
  { label: 'Discovery Flight', rate: '$55/hr + aircraft', note: 'No prior experience needed' },
]

const membershipPlans = [
  {
    name: 'Solo Member',
    price: '$150/mo',
    commitment: '3-month minimum',
    color: 'border-gray-200',
    highlight: false,
    features: [
      '15% off all wet aircraft rates',
      '24/7 online scheduling access',
      'Priority booking (48-hr advance)',
      'No per-flight dispatch fee',
      'Access to pilot lounge & crew room',
      'Free headset loan for flights',
    ],
    note: 'Requires solo endorsement or higher certificate',
  },
  {
    name: 'Flight Club 805',
    price: '$295/mo',
    commitment: '6-month minimum',
    color: 'border-jacRed',
    highlight: true,
    features: [
      '20% off all wet aircraft rates',
      '24/7 online scheduling access',
      'Priority booking (72-hr advance)',
      'No per-flight dispatch fee',
      'Access to pilot lounge & crew room',
      'Free headset loan for flights',
      '1 free ground session per month',
      'Discounted simulator ($58/hr)',
      'Monthly safety seminars included',
      'Partner discounts at KCMA FBOs',
    ],
    note: 'Open to all certificate levels — student through ATP',
  },
  {
    name: 'Student Program',
    price: '$0/mo',
    commitment: 'Active training enrollment',
    color: 'border-gray-200',
    highlight: false,
    features: [
      'Standard aircraft rates',
      '24/7 online scheduling access',
      'Dedicated CFI throughout training',
      'Study materials included',
      'Access to pilot lounge',
      'Free headset loan for lessons',
    ],
    note: 'Automatically enrolled when you begin training with CFI',
  },
]

const trainingPackages = [
  {
    name: 'Private Pilot Certificate',
    hours: '60–80 hrs typical',
    breakdown: [
      { item: 'Dual instruction (45 hrs avg)', cost: '$55 × 45 = $2,475' },
      { item: 'Solo flight time (25 hrs avg)', cost: 'Aircraft only' },
      { item: 'Cessna 172S (60 hrs avg wet)', cost: '$175 × 60 = $10,500' },
      { item: 'FAA Written exam fee', cost: '~$175' },
      { item: 'Checkride (DPE fee)', cost: '~$700' },
    ],
    estimate: '$13,850 – $18,500',
    note: 'Total varies with student aptitude and scheduling frequency. FAA minimum is 40 hours; national average is 65–70 hours.',
  },
  {
    name: 'Instrument Rating',
    hours: '50–60 hrs instrument time',
    breakdown: [
      { item: 'Dual CFII instruction (40 hrs avg)', cost: '$55 × 40 = $2,200' },
      { item: 'Aircraft / Sim time (50 hrs)', cost: 'Mix of DA40 + sim' },
      { item: 'DA40 (30 hrs at $185 wet)', cost: '$5,550' },
      { item: 'Simulator (20 hrs at $65)', cost: '$1,300' },
      { item: 'Checkride (DPE fee)', cost: '~$700' },
    ],
    estimate: '$9,750 – $13,500',
    note: 'Up to 20 simulator hours count toward the 50-hr instrument time requirement under FAR 61.65.',
  },
  {
    name: 'Commercial Certificate',
    hours: '250 total time required',
    breakdown: [
      { item: 'Dual CFI instruction (20 hrs avg new)', cost: '$55 × 20 = $1,100' },
      { item: 'Complex aircraft endorsement (10 hrs)', cost: 'Arranged through CFI' },
      { item: 'Aircraft time (solo PIC building)', cost: 'Varies by hours banked' },
      { item: 'Checkride (DPE fee)', cost: '~$700' },
    ],
    estimate: '$4,500 – $8,000',
    note: 'Assumes Private and Instrument already held. Most of the cost is building PIC cross-country and night time.',
  },
]

const faqItems = [
  {
    q: 'Are rates "wet" or "dry"?',
    a: 'All aircraft rates listed are wet — fuel included. You pay one rate, we handle the fuel. No fuel surprises.',
  },
  {
    q: 'Is there a minimum charge per flight?',
    a: 'Aircraft time is billed in 0.1-hour increments from engine start to engine shutdown (Hobbs time). There is no minimum flight charge, though most instructional lessons run 1.0–1.5 hours.',
  },
  {
    q: 'Do I need a medical to rent an aircraft?',
    a: 'For instruction, no medical is required — you\'re not acting as PIC. For solo flight and rental, a Third-Class Medical or BasicMed qualification is required. We can refer you to an AME if needed.',
  },
  {
    q: 'Can I rent without an instructor?',
    a: 'Yes — certificate holders who complete our club checkout process may rent unaccompanied. Club 805 members get priority access and discounted rates.',
  },
  {
    q: 'What happens if weather cancels a flight?',
    a: 'No charge for weather cancellations when the instructor or CFI deems conditions unsafe. We require 2-hour advance notice for student-initiated cancellations; otherwise a $35 late-cancel fee applies.',
  },
  {
    q: 'Is there a checkout fee for new club members?',
    a: 'Checkout flights (1.0–1.5 hrs with a CFI) are billed at standard dual rates. After checkout you\'re cleared to rent solo.',
  },
]

export default function PricingPage() {
  return (
    <>
      <Head>
        <title>Plans & Pricing | Camarillo Flight Instruction</title>
        <meta name="description" content="Transparent aircraft rental rates, instructor fees, membership plans, and training package estimates at KCMA." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="antialiased selection:bg-jacRed selection:text-white font-sans">
        <Navigation siteSettings={siteSettings} />

        {/* Hero */}
        <header className="relative min-h-[30vh] flex flex-col justify-end pb-12 pt-32 bg-jacLight border-b border-gray-200 overflow-hidden">
          <div className="absolute inset-0 flex justify-center opacity-30 pointer-events-none">
            <div className="w-[2px] h-full runway-centerline" />
          </div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 z-10 w-full">
            <div className="inline-flex items-center sign-loc px-2 py-0.5 mb-4">
              <span className="font-mono text-sm font-bold">RATES & PLANS</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-sans text-jacDark tracking-tight mb-4">
              Pricing.
            </h1>
            <p className="text-gray-500 font-light text-base sm:text-lg max-w-2xl leading-relaxed">
              No hidden fees. No required packages. Fly the airplane you want, with the instructor you choose, at a pace that works for your life.
            </p>
          </div>
        </header>

        {/* Aircraft Rates */}
        <section className="py-16 sm:py-20 bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-jacDark mb-2">Aircraft Rental Rates</h2>
            <p className="text-gray-500 font-light text-sm mb-8">All rates are <strong className="text-jacDark font-medium">wet (fuel included)</strong>, billed in 0.1 hr increments by Hobbs time.</p>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-mono text-[10px] tracking-widest text-gray-400 uppercase">Aircraft</th>
                    <th className="text-left py-3 px-4 font-mono text-[10px] tracking-widest text-gray-400 uppercase hidden sm:table-cell">Category</th>
                    <th className="text-right py-3 px-4 font-mono text-[10px] tracking-widest text-gray-400 uppercase">Standard</th>
                    <th className="text-right py-3 px-4 font-mono text-[10px] tracking-widest text-jacRed uppercase">Club 805</th>
                  </tr>
                </thead>
                <tbody>
                  {aircraftRates.map((r, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-jacLight transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-semibold text-jacDark">{r.aircraft}</div>
                        <div className="text-xs text-gray-400 font-mono">{r.year} · {r.hp}</div>
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-500 hidden sm:table-cell">{r.category}</td>
                      <td className="py-4 px-4 text-right font-mono font-semibold text-gray-600">{r.nonMember}/hr</td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-jacRed">{r.member}/hr</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Instructor Rates */}
        <section className="py-16 sm:py-20 bg-jacLight border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-jacDark mb-2">Instruction Rates</h2>
            <p className="text-gray-500 font-light text-sm mb-8">Instruction is billed separately from the aircraft. One flat rate — no tiers by experience.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {instructorRates.map((r, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded">
                  <div className="shrink-0">
                    <div className="text-xl font-bold font-mono text-jacRed">{r.rate}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-jacDark text-sm">{r.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{r.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Membership Plans */}
        <section className="py-16 sm:py-24 bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-jacDark mb-2">Membership Plans</h2>
            <p className="text-gray-500 font-light text-sm mb-10">Save on every hour you fly. The more you fly, the faster the membership pays for itself.</p>
            <div className="grid md:grid-cols-3 gap-6">
              {membershipPlans.map((plan) => (
                <div key={plan.name} className={`border-2 rounded overflow-hidden flex flex-col ${plan.color} ${plan.highlight ? 'shadow-lg' : ''}`}>
                  {plan.highlight && (
                    <div className="bg-jacRed text-white text-center py-1.5 font-mono text-xs tracking-widest font-bold">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold font-sans text-jacDark">{plan.name}</h3>
                      <div className="text-3xl font-bold font-mono text-jacRed mt-1">{plan.price}</div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">{plan.commitment}</div>
                    </div>
                    <ul className="space-y-2 mb-6 flex-1">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-jacRed shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-gray-400 italic border-t border-gray-100 pt-4">{plan.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Training Package Estimates */}
        <section className="py-16 sm:py-24 bg-jacLight border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-jacDark mb-2">Training Package Estimates</h2>
            <p className="text-gray-500 font-light text-sm mb-10">
              These are realistic estimates based on typical student progression at CFI. Your actual cost will vary — faster students pay less, and we never drag out training.
            </p>
            <div className="space-y-8">
              {trainingPackages.map((pkg) => (
                <div key={pkg.name} className="bg-white border border-gray-100 rounded overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 sm:px-8 py-5 border-b border-gray-50">
                    <div>
                      <h3 className="text-lg font-bold font-sans text-jacDark">{pkg.name}</h3>
                      <div className="text-xs font-mono text-gray-400 tracking-widest mt-0.5">{pkg.hours}</div>
                    </div>
                    <div className="text-right mt-3 sm:mt-0">
                      <div className="text-xs font-mono text-gray-400 tracking-widest">ESTIMATE</div>
                      <div className="text-xl font-bold font-mono text-jacRed">{pkg.estimate}</div>
                    </div>
                  </div>
                  <div className="px-5 sm:px-8 py-5">
                    <div className="space-y-2 mb-4">
                      {pkg.breakdown.map((line, i) => (
                        <div key={i} className="flex justify-between items-start gap-4 text-sm">
                          <span className="text-gray-600">{line.item}</span>
                          <span className="font-mono text-jacDark font-medium shrink-0 text-right">{line.cost}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 border-t border-gray-50 pt-4 leading-relaxed">{pkg.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 sm:py-24 bg-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-jacDark mb-10">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqItems.map((faq, i) => (
                <div key={i} className="border-b border-gray-100 pb-6">
                  <h3 className="font-bold text-jacDark mb-2">{faq.q}</h3>
                  <p className="text-gray-600 font-light text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20 bg-jacDark text-white text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans mb-4">Start Flying Today.</h2>
            <p className="text-gray-300 font-light text-sm mb-8 leading-relaxed">
              A discovery flight is $55/hr instruction + aircraft time. Most run about 1.5 hours. You will fly the airplane from the right seat and land at KCMA. No experience required.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="mailto:info@camarilloflightinstruction.com"
                className="font-mono text-xs font-semibold bg-jacRed text-white px-8 py-3 hover:bg-red-700 transition-colors rounded-sm tracking-wider"
              >
                SCHEDULE A DISCOVERY FLIGHT
              </a>
              <Link
                href="/fleet"
                className="font-mono text-xs font-semibold border border-gray-500 text-gray-300 px-8 py-3 hover:border-white hover:text-white transition-colors rounded-sm tracking-wider"
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
