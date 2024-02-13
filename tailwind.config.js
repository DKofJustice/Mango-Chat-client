/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-blue-100": "#07141D",
        "dark-blue-200": "#0E2434",
        "dark-blue-300": "#0D2F36",
        "dark-blue-400": "#3F3A76",
        "blue": "#2F2D98",
        "blue-100": "#C7C6FF",
        "green-100": "#A3F84E"
      }
    },
  },
  plugins: [],
}

