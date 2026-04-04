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
  if (icon === 'financial') {
    return (
      <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current text-gray-400 group-hover:text-jacRed transition-colors" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    )
  }
  if (icon === 'landuse') {
    return (
      <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current text-gray-400 group-hover:text-jacRed transition-colors" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    )
  }
  if (icon === 'facility') {
    return (
      <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current text-gray-400 group-hover:text-jacRed transition-colors" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    )
  }
  // policy (default)
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current text-gray-400 group-hover:text-jacRed transition-colors" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

export default function Services({ services }: ServicesProps) {
  return (
    <section id="services" className="py-24 relative z-10 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
          <div className="fly-wrap">
            <h2 className="fly-text scroll-fly text-3xl md:text-4xl font-bold font-sans text-jacDark">
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
              className="service-card bg-jacLight p-8 border border-gray-100 hover:border-jacRed hover:shadow-md transition-all duration-300 group interactive"
            >
              <div className="mb-8">
                <ServiceIcon icon={service.icon} />
              </div>
              <h3 className="text-xl font-bold font-sans mb-3 text-jacDark group-hover:text-jacRed transition-colors">
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
