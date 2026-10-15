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
          bg: "rgb(249, 249, 249)",
          bgLight: "#FFFFFF",
          primary: "#B84A22",
          primaryHover: "#9E3E1B",
          dark: "#1A130E",
          cardDark: "#231B15",
          charcoal: "#2D241E",
          gold: "#D49B37",
          cream: "rgb(249, 249, 249)",
          text: "#2C221C",
          muted: "#786960",
          border: "#E5E5E5",
        },
      },
      fontFamily: {
        sans: ["'Poppins'", "sans-serif"],
        serif: ["'Poppins'", "sans-serif"],
        mono: ["'Poppins'", "sans-serif"],
      },
      boxShadow: {
        amber: "0 10px 30px rgba(184, 74, 34, 0.15)",
        card: "0 4px 20px rgba(44, 34, 28, 0.06)",
        cardHover: "0 14px 35px rgba(44, 34, 28, 0.12)",
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "10px",
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};
