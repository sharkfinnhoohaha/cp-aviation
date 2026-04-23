import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // CP Aviation brand palette — navy primary, classic red accent,
        // warm gold for callouts, paper-white surfaces.
        cpNavy:   '#0B2545',
        cpNavyMid:'#1D3F6B',
        cpDark:   '#0B2545',
        cpRed:    '#C8102E',
        cpGold:   '#E8A93E',
        cpLight:  '#F4F1EA',
        cpPaper:  '#FBF9F4',
        runwayGray: '#9CA3AF',
      },
    },
  },
  plugins: [],
}
export default config
