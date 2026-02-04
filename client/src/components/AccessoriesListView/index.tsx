import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { usePagination } from "@/hooks/usePagination";
import { useAccessoryFilters } from "@/hooks/useAccessoryFilters";
import { DetailHeader } from "../common/DetailHeader";
import { AccessoriesTable } from "./AccessoriesTable";
import { Pagination } from "../common/Pagination";
import Spinner from "../common/Spinner";
import { FilterBar } from "../common/FilterBar";
import { ROUTES } from "../AppRoutes";
import { Accessory } from "@/utils/types";

export const AccessoriesListView: React.FC = () => {
  const navigate = useNavigate();
  const { data: masterData, loading } = useAppSelector(
    (state) => state.masterData,
  );

  // Get accessories from masterData (default to empty object if not loaded)
  const accessories = masterData?.accessories ?? {};

  // Custom hook for filters
  const { filters, setFilterColumn, setSearchQuery, filteredAccessories } =
    useAccessoryFilters(accessories);

  const {
    paginatedItems: paginatedAccessories,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination({ items: filteredAccessories, initialItemsPerPage: 25 });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Show spinner only when loading
  if (loading && !masterData) {
    return <Spinner />;
  }

  return (
    <div className="table-view-wrapper">
      <DetailHeader
        label="Accessories"
        title="All Accessories"
        onBack={() => navigate(ROUTES.HOME)}
      />

      <div id="accessories-content" className="table-view-content">
        <div className="table-view-inner-content">
          <FilterBar
            filterColumn={filters.filterColumn}
            searchQuery={filters.searchQuery}
            filterByOptions={["id", "type", "refClient", "connName"]}
            onFilterColumnChange={setFilterColumn}
            onSearchQueryChange={setSearchQuery}
          />

          <div className="table-container-outer">
            <AccessoriesTable
              accessories={paginatedAccessories as Accessory[]}
            />
          </div>

          {filteredAccessories.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredAccessories.length}
              setCurrentPage={setCurrentPage}
              setItemsPerPage={setItemsPerPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};
