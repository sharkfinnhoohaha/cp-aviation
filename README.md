# CP Aviation Website

A modern, cinematic website for CP Aviation — a family-owned flight school at Santa Paula Airport (KSZP) since 1987.

## About CP Aviation

CP Aviation has been "Training Safe Pilots" since 1987. Located at one of the busiest privately owned airfields in the USA, they offer:

- **Private Pilot Training** — From first flight to certificate
- **Instrument Rating** — Master the gauges and fly IFR with confidence
- **Commercial & Instructor** — Career-grade training and instructor certifications
- **Emergency Maneuver Training (EMT)** — Spin training, unusual attitudes, and aerobatics
- **Tailwheel Training** — Master conventional gear with Citabria aircraft
- **Aircraft Maintenance** — Full-service shop specializing in Cessna, Citabrias and Decathlons
- **Vicki Cruse Memorial Scholarship** — Annual scholarship for IAC members pursuing aerobatic training

## Aircraft Fleet

- **Cessna 172 Skyhawk** — Primary trainers, dispatch-ready
- **American Champion Citabria 7ECA** — Tailwheel trainers for endorsements
- **American Champion Decathlon 8KCAB** — Aerobatic aircraft for EMT and spin training

## Location

Santa Paula Airport (KSZP)
830 E Santa Maria St #301
Santa Paula, CA 93060

Just minutes from the beaches of Ventura and Oxnard, with easy access to Camarillo and Point Mugu.

## Technology

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS with custom aviation-themed palette (cpNavy / cpRed / cpGold / cpLight)
- **Animations**: GSAP + Lenis for smooth scroll
- **3D**: React Three Fiber / Three.js for interactive airport exploration and the KSZP Runway 22 simulator
- **CMS**: TinaCMS for content management

## Brand

- **Navy** `#0B2545` — Primary (text, headers, footer)
- **Red** `#C8102E` — Accents and CTAs
- **Gold** `#E8A93E` — Secondary accent, hold-short lines, runway centerline
- **Paper** `#FBF9F4` / **Light** `#F4F1EA` — Surfaces

## Design Notes

This website was adapted from a custom aviation theme, with content specifically crafted for CP Aviation including:

- Full integration of CP Aviation's branding and messaging
- "Stop Wondering & Start Flying" hero section
- Comprehensive service descriptions matching their training programs
- Vicki Cruse Scholarship feature
- Real student testimonials from their website
- Recent student success stories (first solos, new ratings)
- Fleet information for Cessna, Citabria, and Decathlon aircraft
- KSZP Runway 22 flight simulator

## Development

```bash
# One-shot setup (checks Node version and installs deps)
./setup.sh

# Run development server
npm run dev

# Build for production
npm run build
```

## Credits

Original theme adapted for CP Aviation with content, branding, and messaging researched from cpaviation.com.

© 2026 CP Aviation. All rights reserved.
