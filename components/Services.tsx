interface Service {
  title: string
  description: string
  icon: string
}

interface ServicesProps {
  services: {
    sectionTitle: string
    items: Service[]
  }
}

function ServiceIcon({ icon }: { icon: string }) {
  const base = "w-8 h-8 stroke-current text-gray-400 group-hover:text-cpRed transition-colors"
  if (icon === 'wings') {
    // Pilot wings — first certificate
    return (
      <svg viewBox="0 0 24 24" className={base} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2.2" />
        <path d="M12 10V6" />
        <path d="M10 12C7 12 4 13 2 15c3 0 6-.5 8-1.5" />
        <path d="M14 12c3 0 6 1 8 3-3 0-6-.5-8-1.5" />
        <path d="M10.5 13.5C8 14 5.5 15 4 16.5" />
        <path d="M13.5 13.5c2.5.5 5 1.5 6.5 3" />
      </svg>
    )
  }
  if (icon === 'instrument') {
    // Attitude indicator / six-pack gauge
    return (
      <svg viewBox="0 0 24 24" className={base} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M7 15l5-3 5 3" />
        <circle cx="12" cy="12" r="1" />
      </svg>
    )
  }
  if (icon === 'commercial') {
    // Airplane silhouette
    return (
      <svg viewBox="0 0 24 24" className={base} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 16l8-3 3-9 1 0 1 9 7 3-7 1-1 4-1 0-2-4z" />
      </svg>
    )
  }
  if (icon === 'acrobatics') {
    // Looping / aerobatic path
    return (
      <svg viewBox="0 0 24 24" className={base} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a5 5 0 0 1 5 5c0 3-2.5 5-5 8-2.5-3-5-5-5-8a5 5 0 0 1 5-5z" />
        <path d="M12 8v1" />
        <path d="M7 19c1.5-1 3-1.5 5-1.5s3.5.5 5 1.5" />
        <path d="M9 22l3-3 3 3" />
      </svg>
    )
  }
  if (icon === 'tailwheel') {
    // Conventional-gear taildragger silhouette
    return (
      <svg viewBox="0 0 24 24" className={base} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 13l5-2 9-1 5 2-5 1.5-9 .5z" />
        <path d="M11 10V7l3 .5" />
        <circle cx="6" cy="16" r="1.2" />
        <circle cx="14" cy="15" r="1.2" />
        <line x1="2" y1="13" x2="0.5" y2="12" />
      </svg>
    )
  }
  if (icon === 'wrench') {
    // Wrench / maintenance
    return (
      <svg viewBox="0 0 24 24" className={base} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    )
  }
  // Fallback — generic wings
  return (
    <svg viewBox="0 0 24 24" className={base} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2.2" />
      <path d="M10 12C7 12 4 13 2 15c3 0 6-.5 8-1.5" />
      <path d="M14 12c3 0 6 1 8 3-3 0-6-.5-8-1.5" />
    </svg>
  )
}

export default function Services({ services }: ServicesProps) {
  return (
    <section id="services" className="py-24 relative z-10 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
          <div className="fly-wrap">
            <h2 className="fly-text scroll-fly text-3xl md:text-4xl font-bold font-sans text-cpDark">
              {services.sectionTitle}
            </h2>
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full papi-white" />
            <div className="w-2 h-2 rounded-full papi-white" />
            <div className="w-2 h-2 rounded-full papi-red" />
            <div className="w-2 h-2 rounded-full papi-red" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.items.map((service, index) => (
            <div
              key={index}
              className="service-card bg-cpLight p-8 border border-gray-100 hover:border-cpRed hover:shadow-md transition-all duration-300 group interactive"
            >
              <div className="mb-8">
                <ServiceIcon icon={service.icon} />
              </div>
              <h3 className="text-xl font-bold font-sans mb-3 text-cpDark group-hover:text-cpRed transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-500 font-light leading-relaxed text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
