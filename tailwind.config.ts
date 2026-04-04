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
        jacRed: '#DC2626',
        jacDark: '#111827',
        jacLight: '#F9FAFB',
        aviationYellow: '#FBBF24',
        runwayGray: '#9CA3AF',
      },
    },
  },
  plugins: [],
}
export default config
