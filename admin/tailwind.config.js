/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0D0E15',
        surface: '#151722',
        surfaceBorder: '#232638',
        gold: '#F5C518',
        accentCyan: '#2EC4B6',
        accentRed: '#E71D36',
        accentGreen: '#2EC4B6',
      },
    },
  },
  plugins: [],
};
