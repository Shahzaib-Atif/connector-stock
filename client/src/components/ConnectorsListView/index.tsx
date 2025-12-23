import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { usePagination } from "@/hooks/usePagination";
import { useConnectorFilters } from "@/hooks/useConnectorFilters";
import { DetailHeader } from "../common/DetailHeader";
import { ConnectorsTable } from "./components/ConnectorsTable";
import { FilterBar } from "../common/FilterBar";
import { Pagination } from "../common/Pagination";
import Spinner from "../common/Spinner";

export const ConnectorsListView: React.FC = () => {
  const navigate = useNavigate();
  const { data: masterData, loading } = useAppSelector(
    (state) => state.masterData
  );

  // Get connectors from masterData (default to empty object if not loaded)
  const connectors = masterData?.connectors ?? {};

  // Custom hook for filters
  const { filters, setFilterColumn, setSearchQuery, filteredConnectors } =
    useConnectorFilters(connectors);

  const {
    paginatedItems: paginatedConnectors,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination({ items: filteredConnectors, initialItemsPerPage: 25 });

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
        label="Connectors"
        title="All Connectors"
        onBack={() => navigate("/")}
      />

      <div id="connectors-content" className="table-view-content">
        <div className="table-view-inner-content">
          <FilterBar
            filterColumn={filters.filterColumn}
            searchQuery={filters.searchQuery}
            filterByOptions={["id", "type", "fabricante"]}
            onFilterColumnChange={setFilterColumn}
            onSearchQueryChange={setSearchQuery}
          />

          <div className="table-container-outer">
            <ConnectorsTable connectors={paginatedConnectors} />
          </div>

          {filteredConnectors.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredConnectors.length}
              setCurrentPage={setCurrentPage}
              setItemsPerPage={setItemsPerPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};
