/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0A0A0F',
        elevated: '#14141C',
        surface: '#151722',
        surfaceHover: '#1e202f',
        gold: {
          DEFAULT: '#F5C518',
          glow: '#FFD966',
          dark: '#D4A017',
        },
        fitRed: {
          DEFAULT: '#E53E3E',
          hover: '#C53030',
          dark: '#9B1C1C',
          light: '#FED7D7',
        },
        fitBurgundy: '#250b0c',
        fitAmber: '#251b0b',
        fitTeal: '#115C58',
        fitNavy: '#0f1d2e',
        muted: '#9B9BA8',
        accentCyan: '#2EC4B6',
        accentRed: '#E71D36',
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(245, 197, 24, 0.3)',
        'red-glow': '0 0 25px -5px rgba(229, 62, 62, 0.35)',
        'card-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'fit': '0 2px 10px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
