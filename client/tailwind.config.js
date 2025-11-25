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
          '@apply bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all active:scale-[0.98] shadow-lg': {},
        },
        // Secondary action button (slate)
        '.btn-secondary': {
          '@apply bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-6 rounded-xl transition-all border border-slate-600': {},
        },
        // Danger/Remove action button (orange)
        '.btn-danger': {
          '@apply bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 px-6 rounded-xl transition-all active:scale-[0.98] shadow-lg': {},
        },
        // Small icon button
        '.btn-icon': {
          '@apply w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors': {},
        },
        // Small icon button (primary)
        '.btn-icon-primary': {
          '@apply w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors': {},
        },
        // Circular counter button (+/-)
        '.btn-counter': {
          '@apply w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xl hover:bg-slate-600 transition-colors': {},
        },
        // Interactive card button
        '.btn-card': {
          '@apply p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-blue-500/50 transition text-left': {},
        },
        // Ghost button (minimal)
        '.btn-ghost': {
          '@apply p-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors': {},
        },
      })
    }
  ],
}