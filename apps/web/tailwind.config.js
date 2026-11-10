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
          'academic-blue': '#304D7A',
          gold: '#C18A32',
          ivory: '#F8F7F4',
          gray: '#6B7280',
          border: '#E8E5DF',
          bg: '#F4F5F7',
          success: '#16A36A',
          warning: '#E5A12C',
          danger: '#DC5353',
          info: '#3885D8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

