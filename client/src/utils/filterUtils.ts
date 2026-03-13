/**
 * Generic utility to count active filters by comparing them with default values.
 */
export function getActiveFilterCount<T extends Record<string, any>>(
  filters: T,
  defaults: T,
): number {
  let count = 0;

  (Object.keys(defaults) as Array<keyof T>).forEach((key) => {
    const currentValue = filters[key];
    const defaultValue = defaults[key];

    if (currentValue !== defaultValue) {
      // For string inputs, also check if they aren't just whitespace
      if (typeof currentValue === "string" && currentValue.trim() === "") {
        return;
      }

      // If the value is an array, check if it's different from default array (simple length/content check)
      if (Array.isArray(currentValue) && Array.isArray(defaultValue)) {
        if (
          currentValue.length === defaultValue.length &&
          currentValue.every((v, i) => v === defaultValue[i])
        ) {
          return;
        }
      }

      count++;
    }
  });

  return count;
}

export const filterStyles = {
  label: "label-style-1 text-sm mb-[2px] px-2",
  button:
    "inline-flex items-center rounded-lg border border-slate-600 px-3 py-2 text-slate-100 transition-colors text-xs sm:text-sm gap-1 hover:bg-slate-600",
  select:
    "w-full bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
  container: "w-full sm:w-40",
  input:
    "w-full bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
};
