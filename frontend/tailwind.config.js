/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2596be",
        black: "#000000",
        // Custom Vicente Viajes colors
        forest: "#1f2421",
        teal: "#216869",
        "teal-dark": "#1a5559",
        "teal-light": "#d9f0f3",
        sage: "#49a078",
        "sage-light": "#9cc5a1",
        mist: "#e3f2f1",
        midnight: "#1f2421",
        sand: "#f5f5f5",
        ocean: "#216869",
        "ocean-dark": "#1a5559",
        "ocean-light": "#d9f0f3",
        coral: "#49a078",
        sunset: "#ff9a56",
        foreground: "#1f2421",
        background: "#f9fafb",
        "muted-foreground": "#6b7280",
        card: "#ffffff",
        border: "#e5e7eb",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      boxShadow: {
        elevated: "0 8px 40px -8px rgba(33, 104, 105, 0.25)",
        card: "0 4px 24px -4px rgba(31, 36, 33, 0.08)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
