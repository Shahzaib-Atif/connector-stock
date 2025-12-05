import { useState, useMemo, useCallback } from "react";

interface UsePaginationOptions<T> {
  items: T[];
  initialItemsPerPage?: number;
}

interface UsePaginationReturn<T> {
  paginatedItems: T[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  resetPage: () => void;
}

export function usePagination<T>({
  items,
  initialItemsPerPage = 10,
}: UsePaginationOptions<T>): UsePaginationReturn<T> {
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

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    paginatedItems,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    setCurrentPage,
    setItemsPerPage: handleSetItemsPerPage,
    resetPage,
  };
}
