/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./script.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Satoshi"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        'title': ['"Satoshi"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        'body': ['"Satoshi"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif']
      },
      colors: {
        'calm': {
          50: '#f8f9fb',
          100: '#f1f3f7',
          200: '#e4e8ee',
          300: '#d1d7e3',
          400: '#a8b3c7',
          500: '#7d8ca8',
          600: '#5d6b86',
          700: '#4a5568',
          800: '#363f51',
          900: '#252d3d',
        },
        'accent': {
          blue: '#6B8DD6',
          purple: '#8B7FB8',
          teal: '#5FA8A3',
        }
      }
    },
  },
  plugins: [],
}
