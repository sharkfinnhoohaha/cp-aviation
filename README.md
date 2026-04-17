# Camarillo Flight Instruction — Website

A modern, minimalist, and interactive single-page site for Camarillo Flight Instruction & Flight Club 805 at KCMA. Built on Next.js with TinaCMS, GSAP scroll animations, and a Three.js interactive KCMA airfield canvas.

## Setup & Local Development

```bash
npm install
npm run dev
```

The dev server runs TinaCMS alongside Next.js so content in `content/pages/home.json` is editable in-browser at `/admin`.

## Content

All page copy — hero, training programs, about, Flight Club 805, KCMA field, and footer — lives in `content/pages/home.json` and can be edited through the Tina admin UI.

## Technologies

- Next.js 15 / React 18 / TypeScript
- Tailwind CSS
- [TinaCMS](https://tina.io) for visual content editing
- [GSAP & ScrollTrigger](https://greensock.com/gsap/) for scroll animations
- [Three.js](https://threejs.org/) for the interactive KCMA airfield scene

## Deployment

Push to the connected Vercel project. Framework preset: Next.js. No additional configuration required.

---

Site by [Overlook Strategy](https://overlookstrategy.com).
