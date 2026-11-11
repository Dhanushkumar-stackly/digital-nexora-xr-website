/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#05111f",
        secondary: "#8fa1b8",
        tertiary: "#111d2b",
        "black-100": "#081729",
        "black-200": "#05111f",
        "white-100": "#f3f3f3",
        navy: {
          950: "#05111f",
          900: "#111d2b",
          800: "#0a2a52",
        },
        accent: {
          DEFAULT: "#116ef9",
          hover: "#0b5fd8",
          light: "#2b99f2",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      screens: {
        xs: "450px",
      },
    },
  },
  plugins: [],
};
