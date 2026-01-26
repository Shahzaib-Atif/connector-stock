import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { usePagination } from "@/hooks/usePagination";
import { useConnectorFilters } from "@/hooks/useConnectorFilters";
import { DetailHeader } from "../common/DetailHeader";
import { ConnectorsTable } from "./ConnectorsTable";
import { FilterBar } from "../common/FilterBar";
import { Pagination } from "../common/Pagination";
import Spinner from "../common/Spinner";
import { ROUTES } from "../AppRoutes";
import { Connector } from "@/utils/types";
import { useImageToggle } from "./ConnectorsTable/useImageToggle ";
import { useLegacyData } from "./ConnectorsTable/useLegacyData";
import LegacyToggleBtn from "./ConnectorsTable/LegacyToggleBtn";
import ImageToggleBtn from "./ConnectorsTable/ImageToggleBtn";

export const ConnectorsListView: React.FC = () => {
  const navigate = useNavigate();
  const { data: masterData, loading } = useAppSelector(
    (state) => state.masterData,
  );

  // Photo visibility state with persistence
  const { showImages, setShowImages } = useImageToggle();

  // Legacy data handling
  const { isLegacyMode, setIsLegacyMode, legacyData, legacyLoading } =
    useLegacyData();

  // Get connectors from masterData or legacy data
  const connectors = isLegacyMode ? legacyData : (masterData?.connectors ?? {});

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

  // Reset page when filters or mode change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, isLegacyMode]);

  // Show spinner only when loading
  if (loading && !masterData) {
    return <Spinner />;
  }

  if (legacyLoading) {
    return <Spinner />;
  }

  return (
    <div className="table-view-wrapper">
      <DetailHeader
        label={isLegacyMode ? "Legacy Connectors" : "Connectors"}
        title={isLegacyMode ? "Old References" : "All Connectors"}
        onBack={() => navigate(ROUTES.HOME)}
      />

      <div id="connectors-content" className="table-view-content">
        <div className="table-view-inner-content">
          <FilterBar
            filterColumn={filters.filterColumn}
            searchQuery={filters.searchQuery}
            filterByOptions={["id", "type", "fabricante"]}
            onFilterColumnChange={setFilterColumn}
            onSearchQueryChange={setSearchQuery}
          >
            {/* Toggle Buttons */}
            <div className="flex items-center gap-2">
              <ImageToggleBtn
                showImages={showImages}
                isLegacyMode={isLegacyMode}
                setShowImages={setShowImages}
              />{" "}
              <LegacyToggleBtn
                isLegacyMode={isLegacyMode}
                setIsLegacyMode={setIsLegacyMode}
              />
            </div>
          </FilterBar>

          <div className="table-container-outer">
            <ConnectorsTable
              connectors={paginatedConnectors as Connector[]}
              showImages={showImages && !isLegacyMode}
              isLegacyMode={isLegacyMode}
            />
          </div>

          {/* Pagination */}
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
