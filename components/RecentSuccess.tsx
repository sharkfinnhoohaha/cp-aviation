interface SuccessItem {
  title: string
  date: string
  instructor: string
}

interface SuccessCategory {
  name: string
  items: SuccessItem[]
}

interface RecentSuccessProps {
  recentSuccess: {
    sectionTitle: string
    categories: SuccessCategory[]
  }
}

export default function RecentSuccess({ recentSuccess }: RecentSuccessProps) {
  return (
    <section className="py-12 bg-cpDark border-t border-gray-800 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cpRed animate-pulse" />
            <span className="font-mono text-xs tracking-widest text-cpGold uppercase">
              {recentSuccess.sectionTitle}
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-widest text-gray-600">KSZP · SANTA PAULA</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {recentSuccess.categories.map((cat, i) => (
            <div key={i}>
              <div className="font-mono text-[10px] tracking-widest text-gray-500 uppercase mb-3 pb-2 border-b border-gray-800">
                {cat.name}
              </div>
              <ul className="space-y-3">
                {cat.items.map((item, j) => (
                  <li key={j} className="flex flex-col gap-0.5">
                    <span className="text-white text-sm font-light">{item.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-cpGold">{item.date}</span>
                      <span className="text-gray-600">·</span>
                      <span className="font-mono text-[10px] text-gray-500">{item.instructor}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
