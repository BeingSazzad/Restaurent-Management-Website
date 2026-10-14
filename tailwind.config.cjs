/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        amberSpice: {
          bg: "#FAF6EF",
          bgLight: "#FDFBF7",
          primary: "#B84A22",
          primaryHover: "#9E3E1B",
          dark: "#1A130E",
          cardDark: "#231B15",
          charcoal: "#2D241E",
          gold: "#D49B37",
          cream: "#F4EDE2",
          text: "#2C221C",
          muted: "#786960",
          border: "#E9DFD3",
        },
      },
      fontFamily: {
        sans: ["'Poppins'", "sans-serif"],
        serif: ["'Poppins'", "sans-serif"],
      },
      boxShadow: {
        amber: "0 10px 30px rgba(184, 74, 34, 0.15)",
        card: "0 4px 20px rgba(44, 34, 28, 0.06)",
        cardHover: "0 14px 35px rgba(44, 34, 28, 0.12)",
      },
      borderRadius: {
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "20px",
        xl: "28px",
        pill: "100px",
      },
    },
  },
  plugins: [],
};
