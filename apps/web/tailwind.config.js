/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        icms: {
          navy: '#17233F',
          'deep-navy': '#101A32',
          'academic-blue': '#2563EB',
          'sky-blue': '#60A5FA',
          'mint-green': '#DDF7E9',
          'mint-dark': '#0E7A4E',
          emerald: '#10B981',
          gold: '#C18A32',
          ivory: '#F8F7F4',
          gray: '#6B7280',
          border: '#E8E5DF',
          bg: '#F4F5F7',
          success: '#16A36A',
          warning: '#E5A12C',
          danger: '#DC5353',
          info: '#3885D8',
          pending: '#9CA3AF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
