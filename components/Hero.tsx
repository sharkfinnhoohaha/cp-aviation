import { useEffect } from 'react'

interface HeroProps {
  hero: {
    headline: string
    subheadline: string
    primaryCTAText: string
    primaryCTALink: string
    secondaryCTAText: string
    secondaryCTALink: string
  }
}

export default function Hero({ hero }: HeroProps) {
  useEffect(() => {
    // Rabbit sequence animation
    const ids = ['r1', 'r2', 'r3', 'r4', 'r5']
    const rabbitLights = ids.map(id => document.getElementById(id))
    let rabbitIndex = 0

    const interval = setInterval(() => {
      rabbitLights.forEach(light => {
        if (light) {
          light.style.backgroundColor = '#E5E7EB'
          light.style.boxShadow = 'none'
        }
      })
      if (rabbitLights[rabbitIndex]) {
        rabbitLights[rabbitIndex]!.style.backgroundColor = '#DC2626'
        rabbitLights[rabbitIndex]!.style.boxShadow = '0 0 6px rgba(220,38,38,0.6)'
      }
      rabbitIndex = (rabbitIndex + 1) % (ids.length + 2)
    }, 150)

    return () => clearInterval(interval)
  }, [])

  return (
    <header id="hero" className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden pt-24 pb-12 bg-white">
      <div className="absolute inset-0 flex justify-center opacity-40 pointer-events-none">
        <div className="w-[2px] h-full runway-centerline" />
      </div>

      <div className="z-10 text-center px-4 max-w-4xl mx-auto mt-10">
        <div className="flex justify-center gap-2 mb-8 opacity-0 hero-fade transform translate-y-4">
          <div className="w-3 h-3 rounded-full papi-white" />
          <div className="w-3 h-3 rounded-full papi-white" />
          <div className="w-3 h-3 rounded-full papi-red" />
          <div className="w-3 h-3 rounded-full papi-red" />
        </div>

        <div className="fly-wrap mb-6">
          <h1 className="fly-text hero-text text-5xl md:text-7xl lg:text-8xl font-bold font-sans tracking-tight text-cpDark leading-[1.1]">
            {hero.headline}
          </h1>
        </div>
        <div className="fly-wrap mb-10">
          <p className="fly-text hero-text text-base md:text-xl font-sans text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
            {hero.subheadline}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 opacity-0 hero-fade transform translate-y-4">
          <a
            href={hero.primaryCTALink}
            className="w-full sm:w-auto px-8 py-3 bg-cpRed text-white font-mono text-sm tracking-wider font-semibold rounded hover:bg-red-700 transition-colors interactive"
          >
            {hero.primaryCTAText}
          </a>
          <a
            href={hero.secondaryCTALink}
            className="w-full sm:w-auto px-8 py-3 bg-white text-cpDark border border-gray-300 font-mono text-sm tracking-wider font-semibold rounded hover:border-cpRed hover:text-cpRed transition-colors interactive"
          >
            {hero.secondaryCTAText}
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3">
        <div className="rabbit-light" id="r1" />
        <div className="rabbit-light" id="r2" />
        <div className="rabbit-light" id="r3" />
        <div className="rabbit-light" id="r4" />
        <div className="rabbit-light" id="r5" />
      </div>
    </header>
  )
}
