/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: { gray: { 500: '#594f65' } },
      height: {
        128: '32rem',
      },
    },
  },
  plugins: [],
}
