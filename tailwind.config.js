/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {},
    extend: {
      colors: {
        "tw-gray": "rgb(64,63,63)",
        "tw-green": "rgb(2,235,146)",
        "tw-dark-green": "rgb(10, 201, 87)",
      },
    },
  },
};
