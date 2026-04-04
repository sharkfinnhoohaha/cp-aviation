interface NavigationProps {
  siteSettings: {
    logoText: string
    contactEmail: string
  }
}

export default function Navigation({ siteSettings }: NavigationProps) {
  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 glass-panel-light">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div
          className="flex items-center gap-3 interactive cursor-pointer"
          onClick={() => window.scrollTo(0, 0)}
        >
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 90 L50 10 L90 90 Z" stroke="#DC2626" strokeWidth="8" fill="none" strokeLinejoin="round" />
            <path d="M30 60 L70 60" stroke="#DC2626" strokeWidth="8" strokeLinecap="round" />
          </svg>
          <span className="font-sans font-bold text-lg tracking-widest uppercase text-jacDark">
            {siteSettings.logoText}
          </span>
        </div>
        <div className="hidden md:flex gap-8 font-mono text-xs tracking-widest text-gray-500">
          <a href="#specialty" className="hover:text-jacRed transition-colors interactive">SPECIALTY</a>
          <a href="#services" className="hover:text-jacRed transition-colors interactive">SERVICES</a>
          <a href="#about" className="hover:text-jacRed transition-colors interactive">ABOUT</a>
        </div>
        <a
          href={`mailto:${siteSettings.contactEmail}`}
          className="font-mono text-xs font-semibold border border-jacRed text-jacRed px-4 py-2 hover:bg-jacRed hover:text-white transition-colors interactive rounded-sm"
        >
          CONTACT
        </a>
      </div>
    </nav>
  )
}
