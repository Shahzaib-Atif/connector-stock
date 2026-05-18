import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DetailHeader } from "../common/DetailHeader";
import { ROUTES } from "../AppRoutes";
import Spinner from "../common/Spinner";
import { AnaliseTabDto } from "@shared/dto/AnaliseTabDto";
import { FilterToolbar } from "../common/FilterToolbar";
import { useFiltersToggle } from "../../hooks/useFiltersToggle";
import { STORAGE_KEYS } from "@/utils/constants";
import { Pagination } from "../common/Pagination";
import { usePagination } from "@/hooks/usePagination";
import TableHeader from "./components/TableHeader";
import TableRows from "./components/TableRows";
import useFilters from "./components/useFilters";
import useData from "./components/useData";

export const AnaliseTable: React.FC = () => {
  const navigate = useNavigate();
  const { rows, loading, error } = useData();

  const { showFilters, setShowFilters } = useFiltersToggle(
    STORAGE_KEYS.ANALISE_TAB_SHOW_FILTERS,
  );

  // Filters state and logic
  const {
    filters,
    setFilters,
    filteredRows,
    activeFiltersCount,
    clearFilters,
  } = useFilters({ rows });

  // Pagination state and logic
  const {
    paginatedItems,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination({ items: filteredRows });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, setCurrentPage]);

  // Show loading spinner while fetching data
  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="table-view-wrapper">
      <DetailHeader
        label="AnaliseTab"
        title="Analise Tab"
        onBack={() => navigate(ROUTES.HOME)}
      />

      <div className="table-view-content">
        <div className="table-view-inner-content">
          <FilterToolbar
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters((prev) => !prev)}
            onClearFilters={clearFilters}
            activeFiltersCount={activeFiltersCount}
          />

          {error && (
            <div className="rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="table-container-outer">
            <div className="table-container-inner">
              <table className="w-full min-w-[1400px] table-auto">
                <TableHeader
                  filters={filters}
                  setFilters={setFilters}
                  showFilters={showFilters}
                />
                <tbody>
                  <TableRows
                    paginatedItems={paginatedItems as AnaliseTabDto[]}
                  />
                </tbody>
              </table>
            </div>
          </div>

          {filteredRows.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredRows.length}
              setCurrentPage={setCurrentPage}
              setItemsPerPage={setItemsPerPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};
