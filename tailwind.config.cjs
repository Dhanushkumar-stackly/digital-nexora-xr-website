/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#080f1d",
        secondary: "#94a3b8",
        tertiary: "#101b30",
        "black-100": "#0b1426",
        "black-200": "#080f1d",
        "white-100": "#f3f3f3",
        navy: {
          950: "#080f1d",
          900: "#101b30",
          800: "#142d52",
        },
        accent: {
          DEFAULT: "#2563eb",
          hover: "#1d4ed8",
          light: "#60a5fa",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Manrope", "Inter", "system-ui", "sans-serif"],
      },
      screens: {
        xs: "450px",
      },
    },
  },
  plugins: [],
};
