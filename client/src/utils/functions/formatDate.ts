import { getErrorMsg } from "@shared/utils/getErrorMsg";

export const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  } catch (e) {
    console.error(getErrorMsg(e));
    return dateString;
  }
};

export const formatDate2 = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// New function to format date to ISO format (YYYY-MM-DD)
export const formatDateToIso = (
  dateString: string | undefined | null,
): string => {
  if (!dateString) return "-";

  const parsedDate = parseFlexibleDate(dateString);
  if (!parsedDate) return "-";

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Returns a sortable timestamp from ISO or legacy date strings.
export const getFlexibleDateSortValue = (
  dateString: string | undefined | null,
): number => {
  if (!dateString) return Number.NEGATIVE_INFINITY;

  const parsedDate = parseFlexibleDate(dateString);
  return parsedDate ? parsedDate.getTime() : Number.NEGATIVE_INFINITY;
};

// Parses ISO or legacy date strings into a Date object.
function parseFlexibleDate(dateString: string): Date | null {
  const normalizedDate = dateString.trim();
  if (!normalizedDate) return null;

  const isoDateMatch = normalizedDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDateMatch) {
    const [, year, month, day] = isoDateMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  // Matches legacy format: DD/MM/YYYY or DD/MM/YYYY HH:mm[:ss]
  const legacyDateMatch = normalizedDate.match(
    /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/,
  );
  if (legacyDateMatch) {
    const [, day, month, year, hours = "0", minutes = "0", seconds = "0"] =
      legacyDateMatch;

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes),
      Number(seconds),
    );
  }

  return null;
}
