/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        peach: {
          100: '#f6d992',
          200: '#f6cf92',
          300: '#f6c492',
          400: '#f6b092',
          500: '#f6a192',
        },
      },
    },
  },
  plugins: [],
}

