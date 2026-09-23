/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',
        accent: '#F59E0B',
        bg: '#F7F8FC',
        surface: '#FFFFFF',
        text: '#172033',
      },
      fontSize: {
        heading: ['2.25rem', { lineHeight: '1.1', fontWeight: '700' }],
        body: ['1rem', { lineHeight: '1.6' }],
        small: ['0.875rem', { lineHeight: '1.4' }],
      },
      boxShadow: {
        soft: '0 12px 30px rgba(23, 32, 51, 0.07)',
      },
    },
  },
  plugins: [],
}
