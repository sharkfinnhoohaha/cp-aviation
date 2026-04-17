import { useState } from 'react'
import Link from 'next/link'

interface NavigationProps {
  siteSettings: {
    logoText: string
    contactEmail: string
  }
}

export default function Navigation({ siteSettings }: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 glass-panel-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 interactive cursor-pointer shrink-0"
        >
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 90 L50 10 L90 90 Z" stroke="#DC2626" strokeWidth="8" fill="none" strokeLinejoin="round" />
            <path d="M30 60 L70 60" stroke="#DC2626" strokeWidth="8" strokeLinecap="round" />
          </svg>
          <span className="font-sans font-bold text-lg tracking-widest uppercase text-jacDark">
            {siteSettings.logoText}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-6 font-mono text-xs tracking-widest text-gray-500">
          <a href="/#specialty" className="hover:text-jacRed transition-colors interactive">WHY CFI</a>
          <a href="/#services" className="hover:text-jacRed transition-colors interactive">TRAINING</a>
          <Link href="/fleet" className="hover:text-jacRed transition-colors interactive">FLEET</Link>
          <Link href="/pricing" className="hover:text-jacRed transition-colors interactive">PRICING</Link>
          <a href="/#about" className="hover:text-jacRed transition-colors interactive">ABOUT</a>
        </div>

        {/* Right side: simulator button + contact + hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/simulator"
            className="font-mono text-xs font-semibold border border-jacDark text-jacDark px-2 sm:px-3 py-2 hover:bg-jacDark hover:text-white transition-colors interactive rounded-sm hidden sm:flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 16l8-3 3-9 1 0 1 9 7 3-7 1-1 4-1 0-2-4z" />
            </svg>
            SIM
          </Link>
          <a
            href={`mailto:${siteSettings.contactEmail}`}
            className="font-mono text-xs font-semibold border border-jacRed text-jacRed px-3 py-2 hover:bg-jacRed hover:text-white transition-colors interactive rounded-sm hidden sm:block"
          >
            CONTACT
          </a>
          {/* Mobile hamburger */}
          <button
            className="sm:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 interactive"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-jacDark transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-jacDark transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-jacDark transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden glass-panel-light border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
          <a href="/#specialty" className="font-mono text-xs tracking-widest text-gray-600 hover:text-jacRed transition-colors" onClick={() => setMenuOpen(false)}>WHY CFI</a>
          <a href="/#services" className="font-mono text-xs tracking-widest text-gray-600 hover:text-jacRed transition-colors" onClick={() => setMenuOpen(false)}>TRAINING</a>
          <Link href="/fleet" className="font-mono text-xs tracking-widest text-gray-600 hover:text-jacRed transition-colors" onClick={() => setMenuOpen(false)}>FLEET</Link>
          <Link href="/pricing" className="font-mono text-xs tracking-widest text-gray-600 hover:text-jacRed transition-colors" onClick={() => setMenuOpen(false)}>PRICING</Link>
          <a href="/#about" className="font-mono text-xs tracking-widest text-gray-600 hover:text-jacRed transition-colors" onClick={() => setMenuOpen(false)}>ABOUT</a>
          <Link href="/simulator" className="font-mono text-xs tracking-widest text-gray-600 hover:text-jacRed transition-colors flex items-center gap-2" onClick={() => setMenuOpen(false)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 16l8-3 3-9 1 0 1 9 7 3-7 1-1 4-1 0-2-4z" />
            </svg>
            FLIGHT SIMULATOR
          </Link>
          <a
            href={`mailto:${siteSettings.contactEmail}`}
            className="font-mono text-xs font-semibold border border-jacRed text-jacRed px-3 py-2 hover:bg-jacRed hover:text-white transition-colors text-center rounded-sm"
          >
            CONTACT
          </a>
        </div>
      )}
    </nav>
  )
}
