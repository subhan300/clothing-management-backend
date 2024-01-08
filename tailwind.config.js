/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
 
      extend: {
        animation: {
          'shake': 'shake 1s'
        },
      },
    },
    variants: {
      extend: {
        animation: ['responsive', 'hover', 'focus'],
      },
    },
    plugins: [],
}

