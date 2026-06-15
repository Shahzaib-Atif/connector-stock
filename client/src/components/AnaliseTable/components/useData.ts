import { getAnaliseTab } from "@/api/analiseApi";
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

  // Patches connector text for one row in local state.
  const handleUpdateConnector = (
    encomenda: string,
    numLinha: number,
    newConnector: string,
  ) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.Encomenda === encomenda && row.NumLinha === numLinha
          ? { ...row, Conector: newConnector }
          : row,
      ),
    );
  };

  // Patches status for one row in local state.
  const handleUpdateStatus = (
    encomenda: string,
    numLinha: number,
    newStatus: string,
  ) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.Encomenda === encomenda && row.NumLinha === numLinha
          ? { ...row, Estado: newStatus }
          : row,
      ),
    );
  };

  return {
    rows,
    handleUpdateConnector,
    handleUpdateStatus,
    loading,
    error,
    totalItems,
    totalPages,
  };
}
