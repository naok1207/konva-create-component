/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066FF',
        secondary: '#00D4FF',
        success: '#00C851',
        warning: '#FFBB33',
        error: '#FF4444',
      }
    },
  },
  plugins: [],
}