import { getAnaliseTab } from "@/api/samplesApi";
import { AnaliseTabDto } from "@shared/dto/AnaliseTabDto";
import { AnaliseTabFilters } from "./constants";
import { useEffect, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

interface Props {
  filters: AnaliseTabFilters;
  currentPage: number;
  itemsPerPage: number;
  dateSortDirection: "asc" | "desc" | null;
}

export default function useData({
  filters,
  currentPage,
  itemsPerPage,
  dateSortDirection,
}: Props) {
  const [rows, setRows] = useState<AnaliseTabDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedFilters = useDebouncedValue(filters, 250);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    setLoading(true);
    setError(null);

    getAnaliseTab(
      {
        ...debouncedFilters,
        page: currentPage,
        pageSize: itemsPerPage,
        sortBy: "DataAbertura",
        sortDirection: dateSortDirection ?? undefined,
      },
      controller.signal,
    )
      .then((result) => {
        if (!isActive) return;

        setRows(result.items);
        setTotalItems(result.totalItems);
        setTotalPages(result.totalPages);
      })
      .catch((fetchError) => {
        if (!isActive || controller.signal.aborted) {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to fetch AnaliseTab data",
        );
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [currentPage, itemsPerPage, debouncedFilters, dateSortDirection]);

  return {
    rows,
    setRows,
    loading,
    error,
    totalItems,
    totalPages,
  };
}
