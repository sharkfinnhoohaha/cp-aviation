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
        cpBlue: '#1E40AF',
        cpBlueLight: '#3B82F6',
        cpDark: '#111827',
        cpLight: '#F9FAFB',
        aviationYellow: '#FBBF24',
        runwayGray: '#9CA3AF',
      },
    },
  },
  plugins: [],
}
export default config
