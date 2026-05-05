/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a",
        "primary-hover": "#1e293b",
        accent: "#10b981",
        "accent-hover": "#059669",
      },
      screens: {
        xxsm: "332px",
        xsm: "432px",
        xlplus: "1400px",
      },
    },
  },
  plugins: [],
};
