interface FooterProps {
  footer: {
    ctaText: string
    runwayNumber: string
  }
  siteSettings: {
    contactEmail: string
    phone: string
    location: string
    companyName: string
    copyrightYear: string
  }
}

export default function Footer({ footer, siteSettings }: FooterProps) {
  return (
    <footer className="relative w-full bg-white overflow-hidden flex flex-col justify-start items-center pt-24 pb-12">
      <div className="text-center z-20 mb-16 px-4 interactive">
        <h2 className="text-3xl md:text-4xl font-bold font-sans text-jacDark mb-6 tracking-tight">
          {footer.ctaText}
        </h2>
        <a
          href={`mailto:${siteSettings.contactEmail}`}
          className="text-base sm:text-xl md:text-2xl font-mono text-jacRed hover:text-red-800 transition-colors block mb-6 break-all"
        >
          {siteSettings.contactEmail}
        </a>
        <p className="text-gray-500 font-mono text-xs tracking-widest flex flex-col sm:flex-row items-center gap-1 sm:gap-0">
          <span>{siteSettings.phone}</span>
          <span className="hidden sm:inline mx-3 text-gray-300">|</span>
          <span>{siteSettings.location}</span>
        </p>
      </div>

      <div className="w-full max-w-xl mx-auto flex flex-col items-center opacity-60 pointer-events-none">
        <div className="w-[2px] h-24 bg-gray-200 mb-4" style={{ background: 'repeating-linear-gradient(0deg, #E5E7EB, #E5E7EB 10px, transparent 10px, transparent 20px)' }} />
        <div className="text-gray-300 text-6xl font-mono font-bold tracking-tighter leading-none flex items-start">
          {footer.runwayNumber.slice(0, -1)}
          <span className="text-4xl mt-1 ml-1">{footer.runwayNumber.slice(-1)}</span>
        </div>
        <div className="flex gap-2 mt-4">
          <div className="w-2 h-16 bg-gray-200" />
          <div className="w-2 h-16 bg-gray-200" />
          <div className="w-2 h-16 bg-gray-200" />
          <div className="w-6" />
          <div className="w-2 h-16 bg-gray-200" />
          <div className="w-2 h-16 bg-gray-200" />
          <div className="w-2 h-16 bg-gray-200" />
        </div>
      </div>

      <p className="text-gray-400 font-sans text-[10px] mt-16 uppercase tracking-widest">
        © {siteSettings.copyrightYear} {siteSettings.companyName}. All rights reserved.
      </p>
    </footer>
  )
}
