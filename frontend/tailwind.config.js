/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: { 500: '#594f65' },
        brand: {
          accent: '#7c3aed',
          'accent-hover': '#6d28d9',
          'accent-soft': '#f2ebff',
          background: '#faf9fc',
          surface: '#ffffff',
          ink: '#241b30',
          muted: '#594f65',
          border: '#ded4e7',
          nav: '#110d18',
          danger: '#b4233c',
          'danger-soft': '#fff1f3',
          success: '#167352',
          'success-soft': '#edf9f3',
          'focus-light': '#c9a6ff',
        },
      },
      fontFamily: { sans: ['var(--font-manrope, Arial)', 'sans-serif'] },
      spacing: { 4.5: '1.125rem', 13: '3.25rem', 15: '3.75rem' },
      minWidth: ({ theme }) => theme('spacing'),
      minHeight: ({ theme }) => theme('spacing'),
      borderWidth: { 3: '3px' },
      opacity: { 55: '0.55' },
      textUnderlineOffset: { 3: '3px' },
      outlineOffset: { 3: '3px' },
      fontSize: {
        body: ['1rem', '1.5'],
        ui: ['0.9375rem', '1.5'],
        small: ['0.875rem', '1.5'],
        caption: ['0.8125rem', '1.5'],
      },
      borderRadius: { panel: '14px' },
      boxShadow: {
        panel: '0 6px 24px rgb(30 16 53 / 4%)',
        product: '0 4px 16px #32144806',
        'product-hover': '0 10px 28px #4c24721a',
      },
      backgroundImage: {
        hero: 'linear-gradient(90deg, #110d18f5 0%, #110d18d9 33%, #110d1840 65%, transparent 100%)',
        'hero-mobile': 'linear-gradient(180deg, #110d18e8 0%, #110d18b0 60%, #110d1830 100%)',
        guide: 'radial-gradient(circle at 100% 0%, #542c76, transparent 65%)',
        profile: 'radial-gradient(ellipse at top right, #653494 0%, transparent 65%)',
      },
      height: {
        128: '32rem',
      },
    },
  },
  plugins: [],
}
