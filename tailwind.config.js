/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff8ed',
          100: '#ffefd3',
          200: '#ffdba5',
          300: '#ffc06d',
          400: '#ff9a32',
          500: '#f97f0f',
          600: '#ea6408',
          700: '#c24a08',
          800: '#9b3c10',
          900: '#7d3311',
          950: '#431906',
        },
        forest: {
          50: '#f2faf4',
          100: '#e0f3e4',
          200: '#c2e7cb',
          300: '#94d3a4',
          400: '#5fb676',
          500: '#3a9a54',
          600: '#2a7c42',
          700: '#226236',
          800: '#1d4e2e',
          900: '#173f27',
          950: '#0c2316',
        },
        charcoal: {
          50: '#f6f6f7',
          100: '#e2e2e6',
          200: '#c6c6cd',
          300: '#9f9fab',
          400: '#78788a',
          500: '#5c5c6e',
          600: '#4a4a5b',
          700: '#3d3d4a',
          800: '#33333e',
          900: '#1f1f27',
          950: '#131318',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
};
