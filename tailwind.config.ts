import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          900: '#1C2E14',
          700: '#3D7A2A',
          600: '#5A8A3A',
          100: '#EAF4E2',
          50:  '#F1F7EB',
        },
        yellow: {
          DEFAULT: '#F5C518',
          soft:    '#FCEDA8',
        },
        blue: {
          brand:     '#4AABCC',
          'brand-soft': '#DDF0F6',
        },
        orange: {
          brand:     '#E87A30',
          'brand-soft': '#FDE5D2',
        },
        coral: {
          DEFAULT: '#D94F6A',
          soft:    '#FBE0E5',
        },
        bg:     '#F7F9F5',
        card:   '#FFFFFF',
        border: '#E6ECDF',
        muted:  '#6B7A60',
      },
      fontFamily: {
        sans: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(28, 46, 20, 0.07)',
        lg:   '0 8px 28px rgba(28, 46, 20, 0.10)',
      },
    },
  },
  plugins: [],
}

export default config
