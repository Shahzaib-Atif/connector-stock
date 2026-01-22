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
          "@apply border-b border-slate-700 bg-slate-800 uppercase text-xs": {},
        },
        ".table-header-cell": {
          "@apply px-4 py-3 text-left font-semibold text-slate-300 w-32": {},
        },
        ".table-data": {
          "@apply px-4 py-3": {},
        },
        ".table-view-wrapper": {
          "@apply min-h-[500px] h-[100dvh] pb-2 bg-gradient-to-br from-slate-800 to-slate-900 text-slate-200 flex flex-col overflow-hidden":
            {},
        },
        ".table-view-content": {
          "@apply flex-1 overflow-auto sm:overflow-hidden": {},
        },
        ".table-view-inner-content": {
          "@apply max-w-full mx-auto h-full p-3 sm:p-4 flex flex-col gap-4 text-sm sm:text-[0.9rem]": {},
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
        ".table-row": {
          "@apply transition-colors break-normal text-slate-300 overflow-hidden text-ellipsis": {},
        },
          ".table-row-bg": {
          "@apply even:bg-slate-800/90 odd:bg-slate-800/10 hover:bg-slate-700/50": {},
        },
        ".sidebar-btn": {
          "@apply w-full px-4 py-2 md:py-3 text-left text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2 sm:gap-3 text-sm md:text-base": {},
        },
        ".sidebar-btn-icon": {
          "@apply w-4 sm:w-5 w-4 sm:h-5": {},
        },
        ".label-style-1": {
          "@apply block font-semibold mb-1 sm:mb-2": {},
        },
          ".label-style-2": {
          "@apply block text-xs text-slate-400 mb-1": {},
        },
        ".label-style-3": {
          "@apply text-sm font-bold text-slate-400 uppercase tracking-wide": {},
        },
      });
    },
  ],
};
