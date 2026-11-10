/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
      primary: 'rgb(var(--color-primary) / <alpha-value>)',
      accent: '#B45309',
      bg: 'rgb(var(--color-bg) / <alpha-value>)',
      surface: 'rgb(var(--color-surface) / <alpha-value>)',
      text: 'rgb(var(--color-text) / <alpha-value>)',
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
