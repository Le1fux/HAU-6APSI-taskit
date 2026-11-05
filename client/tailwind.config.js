/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      md: '768px',
    },
    extend: {
      colors: {
        primary: '#0F766E',
        accent: '#B45309',
        bg: '#F4F7F6',
        surface: '#FFFFFF',
        text: '#1E293B',
      },
      fontSize: {
        heading: ['1.5rem', { lineHeight: '1.25', fontWeight: '700' }],
        body: ['1rem', { lineHeight: '1.5' }],
        small: ['0.8125rem', { lineHeight: '1.4' }],
      },
      spacing: {
        tight: '8px',
        standard: '32px',
        screen: '24px',
      },
    },
  },
  plugins: [],
}
