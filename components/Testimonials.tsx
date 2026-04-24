interface TestimonialItem {
  quote: string
  author: string
  date: string
  type: string
}

interface TestimonialsProps {
  testimonials: {
    sectionTitle: string
    items: TestimonialItem[]
  }
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section id="testimonials" className="py-24 bg-cpLight border-t border-gray-100 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
          <div className="fly-wrap">
            <h2 className="fly-text scroll-fly text-3xl md:text-4xl font-bold font-sans text-cpDark">
              {testimonials.sectionTitle}
            </h2>
          </div>
          <span className="font-mono text-xs tracking-widest text-gray-400">KSZP · SANTA PAULA</span>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.items.map((item, i) => (
            <div
              key={i}
              className="break-inside-avoid bg-white border border-gray-100 p-6 rounded hover:border-cpRed transition-colors duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, s) => (
                  <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill="#C8102E" className="shrink-0">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-gray-700 font-light text-sm leading-relaxed mb-4">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <div className="flex items-center justify-between gap-2 border-t border-gray-50 pt-4">
                <span className="font-mono text-xs font-semibold text-cpDark">{item.author}</span>
                <span className="font-mono text-[10px] text-gray-400 tracking-widest uppercase">{item.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
