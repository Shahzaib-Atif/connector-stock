import { useState } from "react";

export function useSorting() {
  const [dateSortDirection, setDateSortDirection] = useState<
    "asc" | "desc" | null
  >(null);

  const handleDateSortToggle = () => {
    setDateSortDirection((prev) => {
      if (prev === null) return "desc";
      return prev === "asc" ? "desc" : "asc";
    });
  };

  return {
    dateSortDirection,
    handleDateSortToggle,
  };
}
