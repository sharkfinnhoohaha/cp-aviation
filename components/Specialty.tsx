interface SpecialtyProps {
  specialty: {
    tagLabel: string
    title: string
    body: string
  }
}

export default function Specialty({ specialty }: SpecialtyProps) {
  return (
    <section id="specialty" className="py-24 relative z-10 bg-cpLight">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center sign-loc px-2 py-0.5 mb-8">
          <span className="font-mono text-sm font-bold">{specialty.tagLabel}</span>
        </div>
        <div className="fly-wrap mb-8">
          <h2 className="fly-text scroll-fly text-3xl md:text-5xl font-bold font-sans text-cpDark tracking-tight">
            {specialty.title}
          </h2>
        </div>
        <div className="fly-wrap">
          <p className="fly-text scroll-fly text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
            {specialty.body}
          </p>
        </div>
      </div>
    </section>
  )
}
