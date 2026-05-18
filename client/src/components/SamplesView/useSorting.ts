import { getFlexibleDateSortValue } from "@/utils/functions/formatDate";
import { SamplesDto } from "@shared/dto/SamplesDto";
import { useMemo, useState } from "react";

interface Props {
  filteredSamples: SamplesDto[];
}

export function useSorting({ filteredSamples }: Props) {
  const [dateSortDirection, setDateSortDirection] = useState<
    "asc" | "desc" | null
  >(null);

  const sortedSamples = useMemo(() => {
    if (!dateSortDirection) {
      return filteredSamples;
    }

    return [...filteredSamples].sort((left, right) => {
      const leftValue = getFlexibleDateSortValue(left.Data_recepcao);
      const rightValue = getFlexibleDateSortValue(right.Data_recepcao);

      return dateSortDirection === "asc"
        ? leftValue - rightValue
        : rightValue - leftValue;
    });
  }, [filteredSamples, dateSortDirection]);

  const handleDateSortToggle = () => {
    setDateSortDirection((prev) => {
      if (prev === null) return "desc";
      return prev === "asc" ? "desc" : "asc";
    });
  };

  return {
    sortedSamples,
    dateSortDirection,
    handleDateSortToggle,
  };
}
