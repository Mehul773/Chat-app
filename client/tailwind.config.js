/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: '#ff7900',
        secondary: '#1E2936',
        myBlue: '#2463EA',
      }
    },
  },
  plugins: [],
}

