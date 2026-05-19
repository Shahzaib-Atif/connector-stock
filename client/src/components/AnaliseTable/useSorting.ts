import { getFlexibleDateSortValue } from "@/utils/functions/formatDate";
import { AnaliseTabDto } from "@shared/dto/AnaliseTabDto";
import { useMemo, useState } from "react";

interface Props {
  filteredRows: AnaliseTabDto[];
}

function toDateString(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : value;
}

export function useSorting({ filteredRows }: Props) {
  const [dateSortDirection, setDateSortDirection] = useState<
    "asc" | "desc" | null
  >(null);

  const sortedRows = useMemo(() => {
    if (!dateSortDirection) {
      return filteredRows;
    }

    return [...filteredRows].sort((left, right) => {
      const leftValue = getFlexibleDateSortValue(
        toDateString(left.DataAbertura),
      );
      const rightValue = getFlexibleDateSortValue(
        toDateString(right.DataAbertura),
      );

      return dateSortDirection === "asc"
        ? leftValue - rightValue
        : rightValue - leftValue;
    });
  }, [filteredRows, dateSortDirection]);

  const handleDateSortToggle = () => {
    setDateSortDirection((prev) => {
      if (prev === null) return "desc";
      return prev === "asc" ? "desc" : "asc";
    });
  };

  return {
    sortedRows,
    dateSortDirection,
    handleDateSortToggle,
  };
}
