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
          <svg width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="44" stroke="#0B2545" strokeWidth="5" fill="#FBF9F4" />
            <path d="M50 18 L54 48 L82 54 L82 60 L54 58 L52 74 L60 78 L60 82 L50 80 L40 82 L40 78 L48 74 L46 58 L18 60 L18 54 L46 48 Z" fill="#C8102E" stroke="#0B2545" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          <span className="font-sans font-bold text-lg tracking-widest uppercase text-cpDark">
            {siteSettings.logoText}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-6 font-mono text-xs tracking-widest text-gray-500">
          <a href="/#specialty" className="hover:text-cpRed transition-colors interactive">WHY CP</a>
          <a href="/#services" className="hover:text-cpRed transition-colors interactive">TRAINING</a>
          <Link href="/fleet" className="hover:text-cpRed transition-colors interactive">FLEET</Link>
          <Link href="/pricing" className="hover:text-cpRed transition-colors interactive">PRICING</Link>
          <a href="/#about" className="hover:text-cpRed transition-colors interactive">ABOUT</a>
        </div>

        {/* Right side: simulator button + contact + hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/simulator"
            className="font-mono text-xs font-semibold border border-cpDark text-cpDark px-2 sm:px-3 py-2 hover:bg-cpDark hover:text-white transition-colors interactive rounded-sm hidden sm:flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 16l8-3 3-9 1 0 1 9 7 3-7 1-1 4-1 0-2-4z" />
            </svg>
            SIM
          </Link>
          <a
            href={`mailto:${siteSettings.contactEmail}`}
            className="font-mono text-xs font-semibold border border-cpRed text-cpRed px-3 py-2 hover:bg-cpRed hover:text-white transition-colors interactive rounded-sm hidden sm:block"
          >
            CONTACT
          </a>
          {/* Mobile hamburger */}
          <button
            className="sm:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 interactive"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-cpDark transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-cpDark transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-cpDark transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden glass-panel-light border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
          <a href="/#specialty" className="font-mono text-xs tracking-widest text-gray-600 hover:text-cpRed transition-colors" onClick={() => setMenuOpen(false)}>WHY CP</a>
          <a href="/#services" className="font-mono text-xs tracking-widest text-gray-600 hover:text-cpRed transition-colors" onClick={() => setMenuOpen(false)}>TRAINING</a>
          <Link href="/fleet" className="font-mono text-xs tracking-widest text-gray-600 hover:text-cpRed transition-colors" onClick={() => setMenuOpen(false)}>FLEET</Link>
          <Link href="/pricing" className="font-mono text-xs tracking-widest text-gray-600 hover:text-cpRed transition-colors" onClick={() => setMenuOpen(false)}>PRICING</Link>
          <a href="/#about" className="font-mono text-xs tracking-widest text-gray-600 hover:text-cpRed transition-colors" onClick={() => setMenuOpen(false)}>ABOUT</a>
          <Link href="/simulator" className="font-mono text-xs tracking-widest text-gray-600 hover:text-cpRed transition-colors flex items-center gap-2" onClick={() => setMenuOpen(false)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 16l8-3 3-9 1 0 1 9 7 3-7 1-1 4-1 0-2-4z" />
            </svg>
            FLIGHT SIMULATOR
          </Link>
          <a
            href={`mailto:${siteSettings.contactEmail}`}
            className="font-mono text-xs font-semibold border border-cpRed text-cpRed px-3 py-2 hover:bg-cpRed hover:text-white transition-colors text-center rounded-sm"
          >
            CONTACT
          </a>
        </div>
      )}
    </nav>
  )
}
