/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#10B981', dark: '#059669' },
        accent: { DEFAULT: '#F59E0B' },
      },
    },
  },
  plugins: [],
}
