import { PaginatedData } from "@/utils/types/shared";
import { PaginatedItems_T } from "@/utils/types";
import { useState, useMemo, useCallback } from "react";

interface Props {
  items: PaginatedItems_T;
  initialItemsPerPage?: number;
}

export function usePagination({
  items,
  initialItemsPerPage = 10,
}: Props): PaginatedData {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const handleSetItemsPerPage = useCallback((count: number) => {
    setItemsPerPage(count);
    setCurrentPage(1);
  }, []);

  return {
    paginatedItems,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage: handleSetItemsPerPage,
    totalItems,
  };
}
