/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
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
        muted: '#9B9BA8',
        accentCyan: '#2EC4B6',
        accentRed: '#E71D36',
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(245, 197, 24, 0.3)',
        'card-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
    },
  },
  plugins: [],
};
