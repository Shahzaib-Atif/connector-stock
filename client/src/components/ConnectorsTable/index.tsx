import React, { useEffect, useState } from "react";
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
import { Image, ImageOff } from "lucide-react";
import { Connector } from "@/utils/types/types";

export const ConnectorsListView: React.FC = () => {
  const navigate = useNavigate();
  const { data: masterData, loading } = useAppSelector(
    (state) => state.masterData
  );

  // Photo visibility state with persistence
  const [showImages, setShowImages] = useState<boolean>(() => {
    const saved = localStorage.getItem("connectors_show_images");
    return saved === "true"; // Default to false
  });

  useEffect(() => {
    localStorage.setItem("connectors_show_images", String(showImages));
  }, [showImages]);

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
            <button
              onClick={() => setShowImages(!showImages)}
              className={`w-40 hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium h-[42px] sm:h-auto ${
                showImages
                  ? "bg-blue-500/10 border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
              }`}
            >
              {showImages ? (
                <>
                  <Image className="w-4 h-4" />
                  <span>Photos: Show</span>
                </>
              ) : (
                <>
                  <ImageOff className="w-4 h-4" />
                  <span>Photos: Hide</span>
                </>
              )}
            </button>
          </FilterBar>

          <div className="table-container-outer mt-4">
            <ConnectorsTable
              connectors={paginatedConnectors as Connector[]}
              showImages={showImages}
            />
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
