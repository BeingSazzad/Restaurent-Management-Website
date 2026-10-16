/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amberSpice: {
          primary: "#F15A24",
          primaryHover: "#D94E1C",
          dark: "#1A130E",
          surface: "#FFFFFF",
          muted: "#78716C",
          border: "#E7E5E4",
        },
      },
      fontFamily: {
        sans: ["'Poppins'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
    },
  },
  plugins: [],
};
