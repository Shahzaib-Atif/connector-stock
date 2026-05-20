import { getSamples } from "@/api/samplesApi";
import { SamplesDto } from "@shared/dto/SamplesDto";
import { SampleFilters } from "../constants";
import { useEffect, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

interface Props {
  filters: SampleFilters;
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
  const [rows, setRows] = useState<SamplesDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [entregueOptions, setEntregueOptions] = useState<string[]>([]);
  const debouncedFilters = useDebouncedValue(filters, 250);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    setLoading(true);
    setError(null);

    getSamples(
      {
        ...debouncedFilters,
        page: currentPage,
        pageSize: itemsPerPage,
        sortBy: dateSortDirection ? "Data_recepcao" : "ID",
        sortDirection: dateSortDirection ?? "desc",
      },
      controller.signal,
    )
      .then((result) => {
        if (!isActive) return;

        setRows(result.items);
        setTotalItems(result.totalItems);
        setTotalPages(result.totalPages);
        setEntregueOptions(result.entregueOptions);
      })
      .catch((fetchError) => {
        if (!isActive || controller.signal.aborted) {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to fetch samples",
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
    entregueOptions,
    refetch: () => {
      setLoading(true);
      return getSamples({
        ...debouncedFilters,
        page: currentPage,
        pageSize: itemsPerPage,
        sortBy: dateSortDirection ? "Data_recepcao" : "ID",
        sortDirection: dateSortDirection ?? "desc",
      }).then((result) => {
        setRows(result.items);
        setTotalItems(result.totalItems);
        setTotalPages(result.totalPages);
        setEntregueOptions(result.entregueOptions);
      });
    },
  };
}
