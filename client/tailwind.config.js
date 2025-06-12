/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 🔥 this is the missing line
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a1a2e",
        "primary-light": "#4d6a8c",
        secondary: "#9b59b6",
        "secondary-light": "#d1a1d1",
      },
    },
  },
  plugins: [],
};
