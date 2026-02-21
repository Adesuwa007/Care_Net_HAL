/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease both",
        fadeInUp: "fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        scaleIn: "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
        slideInLeft: "slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};
