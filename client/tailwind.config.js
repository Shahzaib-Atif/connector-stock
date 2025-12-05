/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        // Primary action button (blue)
        '.btn-primary': {
          '@apply bg-blue-600 hover:bg-blue-500 text-white': {},
        },
        '.table-header': {
          '@apply px-4 py-3 text-left font-semibold text-slate-300': {},
        },
        '.table-data': {
          '@apply px-4 py-3': {},
        },
     })
    }
  ],
}