interface Stat {
  value: string
  label: string
  fullWidth: boolean
  subtitle?: string
  subtitleBody?: string
}

interface AboutProps {
  about: {
    title: string
    paragraph1: string
    paragraph2: string
    stats: Stat[]
  }
}

export default function About({ about }: AboutProps) {
  const regularStats = about.stats.filter(s => !s.fullWidth)
  const fullWidthStats = about.stats.filter(s => s.fullWidth)

  return (
    <section id="about" className="py-24 relative z-10 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5">
            <div className="fly-wrap mb-6">
              <h2 className="fly-text scroll-fly text-3xl md:text-4xl font-bold font-sans text-cpDark">
                {about.title}
              </h2>
            </div>
            <div className="w-12 h-1 bg-cpRed mb-8" />
            <div className="fly-wrap mb-6">
              <p className="fly-text scroll-fly text-gray-600 font-light leading-relaxed">
                {about.paragraph1}
              </p>
            </div>
            <div className="fly-wrap">
              <p className="fly-text scroll-fly text-gray-600 font-light leading-relaxed">
                {about.paragraph2}
              </p>
            </div>
          </div>
          <div className="md:col-span-7 grid grid-cols-2 gap-4">
            {regularStats.map((stat, i) => (
              <div key={i} className="p-6 border border-gray-100 bg-cpLight flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-cpRed mb-2 font-mono">{stat.value}</span>
                <span className="text-xs tracking-widest text-gray-500 font-mono">{stat.label}</span>
              </div>
            ))}
            {fullWidthStats.map((stat, i) => (
              <div key={i} className="p-6 border border-gray-100 bg-cpLight flex flex-col items-center justify-center text-center col-span-2">
                <span className="text-sm font-semibold text-cpDark mb-2">{stat.subtitle}</span>
                <span className="text-xs text-gray-500">{stat.subtitleBody}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
