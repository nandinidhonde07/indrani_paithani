export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        maroon: "#800000",
        gold: "#D4AF37",
        cream: "#FFFDD0",
        black: "#000000",
        white: "#FFFFFF",
      },
      fontFamily: {
        heading: ["'Playfair Display'", "serif"],
        body: ["'Poppins'", "sans-serif"],
      },
      boxShadow: {
        premium: "0 10px 30px rgba(0,0,0,0.1)"
      }
    }
  },
  plugins: []
};
