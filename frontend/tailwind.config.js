/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#FDECF4',
          DEFAULT: '#FF4D6D',
          dark: '#8C1F2C'
        }
      }
    }
  },
  plugins: []
};
