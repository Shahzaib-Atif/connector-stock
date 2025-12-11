/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".btn-primary": {
          "@apply bg-blue-600 hover:bg-blue-500 text-white": {},
        },
        ".table-header": {
          "@apply px-4 py-3 text-left font-semibold text-slate-300": {},
        },
        ".table-data": {
          "@apply px-4 py-3": {},
        },
        ".table-view-wrapper": {
          "@apply min-h-screen h-screen bg-gradient-to-br from-slate-800 to-slate-900 text-slate-200 flex flex-col overflow-hidden":
            {},
        },
        ".table-view-content": {
          "@apply flex-1 overflow-auto sm:overflow-hidden": {},
        },
        ".table-view-inner-content": {
          "@apply max-w-full mx-auto h-full p-4 flex flex-col gap-4": {},
        },
        ".table-container-inner": {
          "@apply h-full overflow-auto rounded-xl border border-slate-700 bg-slate-800/50":
            {},
        },
        ".table-container-outer": {
          "@apply flex-1 min-h-fit sm:min-h-0 max-h-screen": {},
        },
        ".table-row-not-found": {
          "@apply px-4 py-8 text-center text-slate-400": {},
        },
      });
    },
  ],
};
